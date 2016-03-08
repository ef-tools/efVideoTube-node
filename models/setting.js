'use strict'
let _ = require("lodash");
let r = require("../utils/rethinkdb")();
let config = require("../config");

const SCHEMA = ["userName", "media"];

let table = r.table("settings");

const defaultPlayerSetting = (function () {
    let media = {};
    config.media.forEach((players, type) => {
        media[type] = {
            "active": null,
            "player": players
        };
    })
    return { "media": media };
})();

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

Setting.getPlayerSettingByDbSetting = function* (dbSetting) {
    let playerSetting =  Object.assign({}, defaultPlayerSetting);
    if (dbSetting != null && dbSetting.media != null) {
        Object.keys(dbSetting.media).forEach((key) => {
            let activePlayer = dbSetting.media[key];
            playerSetting["media"][key]["active"] = activePlayer;
            playerSetting["media"][key]["player"]
                .splice(playerSetting["media"][key]["player"].indexOf(activePlayer), 1);
        });
    }
    return playerSetting;
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