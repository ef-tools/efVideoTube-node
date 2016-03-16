'use strict'
let util = require("util");
let fs = require("fs");
let Path = require("path");
let constant = require("./constant");

let mediaPlayers = new Map();
// first player will be set as the default
mediaPlayers.set(".mp4", [constant.players.h5video, constant.players.silverlight, constant.players.flash]);
mediaPlayers.set(".webm", [constant.players.h5video]);
mediaPlayers.set(".wmv", [constant.players.silverlight]);
mediaPlayers.set(".flv", [constant.players.flash]);
mediaPlayers.set(".m4a", [constant.players.h5audio, constant.players.silverlight]);
mediaPlayers.set(".mp3", [constant.players.h5audio, constant.players.silverlight]);
mediaPlayers.forEach((players) => {
    players.push(constant.players.none);
});

let mediaPath = Path.join(process.cwd(), constant.mediaDirectoryName);
fs.mkdir(mediaPath, (e) => { });

module.exports = {
    port: 3000,
    secret: "efVideoTube",
    rethinkdb: {
        host: "localhost",
        port: 28015,
        db: "efvt"
    },
    media: mediaPlayers,
    mediaPath: mediaPath,
    splittableExts: [".mp4", ".webm"]
};