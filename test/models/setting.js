'use strict'
require("co-mocha");
let assert = require("assert");
let Setting = require("../../models/setting");
let constant = require("../../constant");

describe("Test setting model", function() {
    let userName = "erich_test";
    let customMedia = { ".mp4": constant.players.h5video };

    afterEach(function* () {
        yield Setting.deleteByUserName(userName);
    });

    it("should create a setting", function* () {
        let setting = new Setting();
        assert.equal(typeof setting, "object");
    });

    it("should assign fields", function* () {
        let setting = new Setting({ userName: userName, media: customMedia });
        assert.equal(setting.userName, userName);
        assert.equal(setting.media, customMedia);
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
        assert(dbSetting instanceof Setting);
        assert.equal(dbSetting.userName, userName);
        assert.deepEqual(dbSetting.media, customMedia);
    });

    it("should delete a setting", function* () {
        let setting = new Setting({ userName: userName, media: customMedia });
        yield setting.save();
        yield Setting.deleteByUserName(userName);
        let dbSetting = yield Setting.findByUserName(userName);
        assert.equal(typeof dbUser, "undefined");
    });
});