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

        let webModel;
        if (helper.getMediaType(ext) === constant.types.video) {
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

            webModel = {
                type: constant.types.video,
                player: setting.media[ext],
                name: Path.basename(relativePath),
                video: helper.getMediaUrl(relativePath),
                subtitles: _.flatMap(config.langs, v => {
                    return langSubtitles.has(v) ? langSubtitles.get(v) : [];
                }),
                parent: null
            };
            if (helper.canExtract(ext))
                webModel.audio = util.format("%s?path=%s",
                    constant.urls.audio, encodeURIComponent(relativePath));
            if (webModel.subtitles.length)
                webModel.subtitles[0].default = true;
        } else {
            webModel = {
                type: constant.types.audio,
                player: setting.media[ext],
                name: Path.basename(relativePath),
                audio: helper.getMediaUrl(relativePath),
                parent: null
            };
        }
        helper.setParent(webModel, relativePath);
        this.body = webModel;
    }
};