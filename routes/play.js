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

        let webModel;
        if (helper.getMediaType(ext) === constant.types.video) {
            webModel = {
                type: constant.types.video,
                player: setting.media[ext],
                name: Path.basename(relativePath),
                video: helper.getMediaUrl(relativePath),
                subtitles: [],
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