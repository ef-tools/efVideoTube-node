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
        try {
            yield fs.statAsync(absolutePath);
        } catch (e) {
            this.status = 404;
            return;
        }
        let setting = yield Setting.findByUserName(this.claims.userName);
        setting = Setting.injectDefaults(setting);
        
        let files = yield fs.readdirAsync(Path.dirname(absolutePath));
        let nameWithoutExt = Path.basename(relativePath, ext);
        let partner = new RegExp(`${nameWithoutExt}.*$`, "i");
        let subtitles = files.filter(f => partner.test(f) && _.includes(config.subtitleExts, Path.extname(f)));
        let defaultSub = null;
        let subModels = subtitles.map(function(s) {
            let subtitleLang = config.subtitleLangs.get(Path.extname(Path.basename(s, Path.extname(s))).toLowerCase());
            if (!defaultSub || subtitleLang.order < defaultSub.order) {
                defaultSub = { srclang: subtitleLang.lang, order: subtitleLang.order };
            }
            return {
                src:  util.format("%s?path=%s", constant.urls.subtitle, encodeURIComponent(Path.join(Path.dirname(relativePath), s))),
                srclang: subtitleLang.lang,
                label: subtitleLang.label,
                default: false,
            }
        });
        if (subModels.length > 0) subModels.find((m) => m.srclang == defaultSub.srclang).default = true;

        let webModel;
        if (helper.getMediaType(ext) === constant.types.video) {
            webModel = {
                type: constant.types.video,
                player: setting.media[ext],
                name: Path.basename(relativePath),
                video: helper.getMediaUrl(relativePath),
                subtitles: subModels,
                parent: null
            };
            if (helper.canExtract(ext))
                webModel.audio = util.format("%s?path=%s",
                    constant.urls.audio, encodeURIComponent(relativePath));
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