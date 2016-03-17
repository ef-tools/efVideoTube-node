'use strict'
let util = require("util");
let fs = require("fs");
let Path = require("path");
let constant = require("./constant");

let mediaDirectoryName = "Media";
let cacheDirectoryName = "MediaCache";
let sc = { srcLang: "zh-hans", label: "中文(简体)" };
let tc = { srcLang: "zh-hant", label: "中文(繁體)" };
let jp = { srcLang: "ja", label: "日本語" };
let en = { srcLang: "en", label: "English" };
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
    splittableExts: [".mp4", ".webm"],
    langs: [sc, tc, jp, en],
    subtitleExts: [".srt", ".ass", ".ssa"],
    subtitleLangs: new Map()
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

config.subtitleLangs.set(".sc", sc);
config.subtitleLangs.set(".chs", sc);
config.subtitleLangs.set(".tc", tc);
config.subtitleLangs.set(".cht", tc);
config.subtitleLangs.set(".jp", jp);
config.subtitleLangs.set(".jpn", jp);
config.subtitleLangs.set(".en", en);
config.subtitleLangs.set(".eng", en);

fs.mkdir(config.mediaPath, (e) => { });
fs.mkdir(config.cachePath, (e) => { });

module.exports = config;