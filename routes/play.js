'use strict'
let util = require("util");
let fs = require("fs");
let Path = require("path");
let _ = require("lodash");
let bluebird = require("bluebird");
let Setting = require("../models/setting");
let helper = require("../utils/helper");
let config = require("../config");
let constant = require("../constant");

bluebird.promisifyAll(fs);

let getLangSubtitleMaps = function* (relativePath, ext, itemNames) {
    let parentRelativePath = Path.dirname(relativePath);
    let nameWithoutExt = Path.basename(relativePath, ext);
    let pattern = new RegExp(util.format("^%s.+?(%s)$", nameWithoutExt, config.subtitleExts.join("|")), "i");
    let langSubtitles = new Map();
    for (let itemName of itemNames) {
        let itemRelativePath = Path.join(parentRelativePath, itemName);
        if (!(yield fs.statAsync(Path.join(config.mediaPath, itemRelativePath))).isDirectory() && pattern.test(itemName)) {
            let lang = helper.parseLang(itemName);
            if (!langSubtitles.has(lang))
                langSubtitles.set(lang, []);
            langSubtitles.get(lang).push({
                src: util.format("%s?path=%s", constant.urls.subtitle, encodeURIComponent(itemRelativePath)),
                srclang: lang.srcLang,
                label: lang.label
            });
        }
    }
    return langSubtitles;
};

module.exports = {
    get: function* () {
        let relativePath = this.query.path || "";
        let ext = Path.extname(relativePath).toLowerCase();
        if (!config.media.has(ext)) {
            this.status = 400;
            return;
        }
        let absolutePath = Path.join(config.mediaPath, relativePath);
        let itemNames;
        try {
            yield fs.statAsync(absolutePath);
            itemNames = yield fs.readdirAsync(Path.dirname(absolutePath));
        } catch (e) {
            this.status = 404;
            return;
        }
        let setting = yield Setting.findByUserName(this.claims.userName);
        setting = Setting.injectDefaults(setting);

        let mediaType = config.media.get(ext).type;
        let webModel = {
            player: setting.media[ext],
            name: Path.basename(relativePath, Path.extname(relativePath))
        };
        webModel[mediaType] = helper.getMediaUrl(relativePath);
        helper.setParent(webModel, relativePath);
        if (mediaType === constant.types.video) {
            let langSubMap = yield getLangSubtitleMaps(relativePath, ext, itemNames);
            webModel.subtitles = _.flatMap(config.langs, v => {
                return langSubMap.has(v) ? langSubMap.get(v) : [];
            });
            if (webModel.subtitles.length)
                webModel.subtitles[0].default = true;
            if (helper.canExtract(ext))
                webModel[constant.types.audio] = util.format("%s?path=%s",
                    constant.urls.audio, encodeURIComponent(relativePath));
        }
        this.body = webModel;
    }
};