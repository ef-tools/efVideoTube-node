'use strict'
let parse = require("co-body");
let Setting = require("../models/setting");

module.exports = {
    get: function* () {
        let setting = yield Setting.findByUserName(this.claims.userName);
        this.body = yield Setting.getPlayerSettingByDbSetting(setting);
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