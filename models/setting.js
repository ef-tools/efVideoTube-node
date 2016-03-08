'use strict'
let _ = require("lodash");
let r = require("../utils/rethinkdb")();
let config = require("../config");

const SCHEMA = ["userName", "media"];

let table = r.table("settings");

let Setting = function (properties) {
   _.assign(this, properties);
};

Setting.findByUserName = function* (userName) {
    let setting;
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
    let model = _.pick(this, SCHEMA);
    _.pick(model.media, Array.from(config.media.keys()));
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
};

module.exports = Setting;