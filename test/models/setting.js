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
        assert.strictEqual(typeof setting, "object");
    });

    it("should assign fields", function* () {
        let setting = new Setting({ userName: userName, media: customMedia });
        assert.strictEqual(setting.userName, userName);
        assert.strictEqual(setting.media, customMedia);
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
        assert.strictEqual(dbSetting.userName, userName);
        assert.deepStrictEqual(dbSetting.media, customMedia);
    });

    it("should not save with empty media", function* () {
        let setting = new Setting({ userName: userName });
        yield setting.save();
        assert.strictEqual(typeof setting.id, "undefined");

        setting.media = {};
        yield setting.save();
        assert.strictEqual(typeof setting.id, "undefined");

        setting.media = { p: "whatever" };
        yield setting.save();
        assert.strictEqual(typeof setting.id, "undefined");
    });

    it("should filter invalid extensions", function* () {
        let setting = new Setting({
            userName: userName,
            media: {
                ".mpc": constant.players.h5video,
                ".wmv": constant.players.silverlight
            }
        });
        yield setting.save();
        assert.strictEqual(Object.keys(setting.media).length, 1);
        assert(".wmv" in setting.media);

        let dbSetting = yield Setting.findByUserName(userName);
        assert.deepStrictEqual(dbSetting, setting);
    });

    it("should filter extensions with invalid players", function* () {
        let setting = new Setting({
            userName: userName,
            media: {
                ".mp4": constant.players.none,
                ".wmv": "whatever invalid",
                ".flv": constant.players.h5video
            }
        });
        yield setting.save();
        assert.strictEqual(Object.keys(setting.media).length, 1);
        assert(".mp4" in setting.media);

        let dbSetting = yield Setting.findByUserName(userName);
        assert.deepStrictEqual(dbSetting, setting);
    });

    it("should delete a setting", function* () {
        let setting = new Setting({ userName: userName, media: customMedia });
        yield setting.save();
        yield Setting.deleteByUserName(userName);
        let dbSetting = yield Setting.findByUserName(userName);
        assert.strictEqual(dbSetting, null);
    });
});