'use strict'
let constant = require("./constant");

let config = {
    rethinkdb: {
        host: "localhost",
        port: 28015,
        db: "efvt"
    },
    secret: "efVideoTube",
    media: new Map()
};

config.media.set(".mp4", [constant.players.h5video, constant.players.silverlight, constant.players.flash]);
config.media.set(".webm", [constant.players.h5video]);
config.media.set(".wmv", [constant.players.silverlight]);
config.media.set(".flv", [constant.players.flash]);
config.media.set(".m4a", [constant.players.h5audio, constant.players.silverlight]);
config.media.set(".mp3", [constant.players.h5audio, constant.players.silverlight]);

module.exports = config;