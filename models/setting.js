'use strict'
let _ = require("lodash");
let r = require("../utils/rethinkdb")();
let config = require("../config");
let constant = require("../constant");

const SCHEMA = ["userName", "media"];

let table = r.table("settings");

let Setting = function(properties) {
    _.assign(this, properties);
};

Setting.findByUserName = function* (userName) {
    let setting = null;
    let result = yield table.getAll(userName, { index: "userName" });
    if (result && result.length) {
        setting = result[0];
        Object.setPrototypeOf(setting, Setting.prototype);
    }
    return setting;
};

Setting.deleteByUserName = function* (userName) {
    yield table.getAll(userName, { index: "userName" }).delete();
};

Setting.prototype.save = function* () {
    this.media = _.pick(this.media, Array.from(config.media.keys()));
    for (let ext of Object.keys(this.media)) {
        if (this.media[ext] !== constant.players.none && !_.includes(config.media.get(ext), this.media[ext]))
            delete this.media[ext];
    }

    if (Object.keys(this.media).length) {
        let model = _.pick(this, SCHEMA);
        let result;
        if (this.id) {
            result = yield table.get(this.id).update(model);
        }
        else {
            result = yield table.insert(model);
            if (result && result.inserted) {
                this.id = result.generated_keys[0];
            }
        }
    }
};

module.exports = Setting;