'use strict'
require("co-mocha");
let assert = require("assert");
let Setting = require("../../models/setting");

describe("Test setting model", function () {
    let userName = "erich_test";
    let customMedia = { ".mp4": "h5video" };
    
    after(function* () {
        yield Setting.deleteByUserName(userName);
    });

    it("should create a setting", function* () {
        let setting = new Setting();
        assert.equal("object", typeof setting);
    });

    it("should assign fields", function* () {
        let setting = new Setting({ userName: userName, media: customMedia });
        assert.equal(userName, setting.userName);
        assert.equal(customMedia, setting.media);
    });

    it("should have id after being saved to db", function* () {
        let setting = new Setting({ userName: userName, media: customMedia });
        yield setting.save();
        assert(setting.id);
    });
    
    it("should find a saved setting by userName", function* () {
        let setting = new Setting({ userName: userName, media: customMedia });
        yield setting.save();
        let dbSetting = yield Setting.findByUserName(userName);
        assert(userName, dbSetting.userName);
        assert(customMedia, dbSetting.media);
        assert(dbSetting instanceof Setting);
    });

    it("should get default media value when media type not be set", function* () {
        let setting = new Setting({ userName: userName, media: null });
        yield setting.save();
        let playerSetting = yield Setting.getPlayerSettingByDbSetting(setting);
        assert(playerSetting["media"][".mp4"], null);
    });
    
    it("should get custom media value after media type setting saved", function* () {
        let setting = new Setting({ userName: userName, media: customMedia });
        yield setting.save();
        let playerSetting = yield Setting.getPlayerSettingByDbSetting(setting);
        assert(playerSetting["media"][".mp4"]["active"], customMedia[".mp4"]);
        assert(playerSetting["media"][".mp4"]["player"].indexOf(customMedia[".mp4"]) < 0);
    });
});