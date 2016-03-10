'use strict'
let parse = require("co-body");
let _ = require("lodash");
let Setting = require("../models/setting");
let config = require("../config");
let constant = require("../constant");

module.exports = {
    get: function* () {
        let setting = yield Setting.findByUserName(this.claims.userName);
        let media = {};
        config.media.forEach((players, ext) => {
            let isValid = setting && (setting.media[ext] === constant.players.none || _.includes(players, setting.media[ext]));
            media[ext] = {
                active: isValid ? setting.media[ext] : players[0],
                players: players
            }
        });
        this.body = { media: media };
    },
    post: function* () {
        let body = yield parse(this);
        let setting = yield Setting.findByUserName(this.claims.userName);
        if (setting === null)
            setting = new Setting({ userName: this.claims.userName });
        setting.media = body.media;
        yield setting.save();
        this.status = 200;
    }
};