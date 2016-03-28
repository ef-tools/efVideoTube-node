'use strict'
let _ = require("lodash");
let r = require("../utils/rethinkdb");
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
    let setting = yield* r.find(TABLE_NAME, userName, "userName");
    if (setting) {
        Object.setPrototypeOf(setting, Setting.prototype);
    }
    return setting;
};

Setting.deleteByUserName = function* (userName) {
    yield* r.remove(TABLE_NAME, userName, "userName");
};

Setting.prototype.save = function* () {
    this.media = _.pick(this.media, Array.from(config.media.keys()));
    for (let ext of Object.keys(this.media)) {
        if (!_.includes(config.media.get(ext).players, this.media[ext]))
            delete this.media[ext];
    }

    if (Object.keys(this.media).length) {
        yield* r.save(TABLE_NAME, this, SCHEMA);
    }
};

module.exports = Setting;