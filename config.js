'use strict'
let util = require("util");
let fs = require("fs");
let Path = require("path");
let constant = require("./constant");

let mediaDirectoryName = "Media";
let cacheDirectoryName = "MediaCache";
let config = {
    port: 3000,
    secret: "efVideoTube",
    rethinkdb: {
        host: "localhost",
        port: 28015,
        db: "efvt"
    },
    media: new Map(),
    mediaDirectoryName: mediaDirectoryName,
    cacheDirectoryName: cacheDirectoryName,
    mediaPath: Path.join(process.cwd(), mediaDirectoryName),
    cachePath: Path.join(process.cwd(), cacheDirectoryName),
    splittableExts: [".mp4", ".webm"]
};

// first player will be set as the default
config.media.set(".mp4", [constant.players.h5video, constant.players.silverlight, constant.players.flash]);
config.media.set(".webm", [constant.players.h5video]);
config.media.set(".wmv", [constant.players.silverlight]);
config.media.set(".flv", [constant.players.flash]);
config.media.set(".m4a", [constant.players.h5audio, constant.players.silverlight]);
config.media.set(".mp3", [constant.players.h5audio, constant.players.silverlight]);
config.media.forEach((players) => {
    players.push(constant.players.none);
});

fs.mkdir(config.mediaPath, (e) => { });
fs.mkdir(config.cachePath, (e) => { });

module.exports = config;