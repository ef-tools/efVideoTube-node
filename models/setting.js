'use strict'
let _ = require("lodash");
let r = require("../utils/rethinkdb")();

const SCHEMA = ["userName"];

let table = r.table("settings");

let Setting = function (properties) {
   _.assign(this, properties);
};

Setting.findByUserName = function* (userName) {
    let setting;
    let result = yield table.filter({ userName: userName });
    if (result && result.length) {
        setting = result[0];
        Object.setPrototypeOf(setting, Setting.prototype);
    }
    return setting;
};

Setting.deleteByUserName = function* (userName) {
    yield table.filter({ userName: userName }).delete();
};

Setting.prototype.save = function* () {
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
};

module.exports = Setting;