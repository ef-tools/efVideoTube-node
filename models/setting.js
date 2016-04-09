'use strict'
let _ = require("lodash");
let db = require("../db/db-proxy");
let config = require("../config");
let constant = require("../constant");

const TABLE_NAME = "settings";
const SCHEMA = ["userName", "media"];

let Setting = function (properties) {
    _.assign(this, properties);
};

Setting.injectDefaults = function (setting) {
    if (!setting)
        setting = { media: {} };
    for (let [ext, extConfig] of config.media) {
        if (!_.includes(extConfig.players, setting.media[ext]))
            setting.media[ext] = extConfig.players[0];
    }
    return setting;
};

Setting.findByUserName = function* (userName) {
    let setting = yield* db.findByUserName(TABLE_NAME, userName);
    if (setting) {
        Object.setPrototypeOf(setting, Setting.prototype);
    }
    return setting;
};

Setting.deleteByUserName = function* (userName) {
    yield* db.deleteByUserName(TABLE_NAME, userName);
};

Setting.prototype.save = function* () {
    this.media = _.pick(this.media, Array.from(config.media.keys()));
    for (let ext of Object.keys(this.media)) {
        if (!_.includes(config.media.get(ext).players, this.media[ext]))
            delete this.media[ext];
    }

    if (Object.keys(this.media).length) {
        yield* db.save(TABLE_NAME, this, SCHEMA);
    }
};

module.exports = Setting;