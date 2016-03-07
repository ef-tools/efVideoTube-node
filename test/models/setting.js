'use strict'
let assert = require("assert");
let Setting = require("../../models/setting");

describe("Test setting model", function () {
    let userName = "erich_test";
    let media = { ".mp4": "h5video" }
    
    after(function* () {
        yield Setting.deleteByUserName(userName);
    });

    it("should create a setting", function* () {
        let setting = new Setting();
        assert.equal("object", typeof setting);
    });

    it("should assign fields", function* () {
        let setting = new Setting({ userName: userName, media: media });
        assert.equal(userName, setting.userName);
        assert.equal(media, setting.media);
    });

    it("should have id after being saved to db", function* () {
        let setting = new Setting({ userName: userName, media: media });
        yield setting.save();
        assert(setting.id);
    });

    it("should find a saved setting by userName", function* () {
        let setting = new Setting({ userName: userName, media: media });
        yield setting.save();
        let dbSetting = yield Setting.findByUserName(userName);
        assert(userName, dbSetting.userName);
        assert(media, dbSetting.media);
        assert(dbSetting instanceof Setting);
    });
});