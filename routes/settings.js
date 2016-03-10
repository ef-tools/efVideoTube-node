'use strict'
let parse = require("co-body");
let Setting = require("../models/setting");
let config = require("../config");

var generateMediaWebModel = function (setting) {
    let defaultMedia = { media: {} };
    for (let ext of Array.from(config.media.keys())) {
        defaultMedia.media[ext] = {};
        defaultMedia.media[ext].players = config.media.get(ext);
        if (setting && setting.media[ext]) {
            defaultMedia.media[ext].active = setting.media[ext];
        }
        else {
            defaultMedia.media[ext].active = defaultMedia.media[ext].players[0];
        }
    }
    return defaultMedia;
};

module.exports = {
    get: function* () {
        let setting = yield Setting.findByUserName(this.claims.userName);
        this.body = generateMediaWebModel(setting);
    },
    post: function* () {
        let body = yield parse(this);
        let setting = yield Setting.findByUserName(this.claims.userName);
        if (setting == null) {
            setting = new Setting({ userName: this.claims.userName });
        }
        setting.media = body.media;
        yield setting.save();
        if (setting.id == undefined) {
            this.throw(500, "save failed.");
        };
        this.body = setting.id;
    }
};