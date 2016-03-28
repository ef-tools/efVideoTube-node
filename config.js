'use strict'
let fs = require("fs");
let Path = require("path");
let c = require("config");
let constant = require("./constant");

let sc = { srcLang: "zh-hans", label: "中文(简体)" };
let tc = { srcLang: "zh-hant", label: "中文(繁體)" };
let jp = { srcLang: "ja", label: "日本語" };
let en = { srcLang: "en", label: "English" };
let config = {
    port: c.get("port"),
    secret: c.get("secret"),
    dbType: c.get("dbType"),
    redis: {
        host: c.get("redis.host"),
        port: c.get("redis.port"),
        db: c.get("redis.db")
    },
    rethinkdb: {
        host: c.get("rethinkdb.host"),
        port: c.get("rethinkdb.port"),
        db: c.get("rethinkdb.db"),
        silent: false
    },
    media: new Map(),
    demuxers: new Map(),
    subtitleLangs: new Map(),
    subtitleExts: [".ass", ".ssa", ".srt"],
    langs: [sc, tc, jp, en],
    mediaDirectoryName: c.get("mediaDirectoryName"),
    cacheDirectoryName: c.get("cacheDirectoryName"),
    mediaPath: Path.join(process.cwd(), c.get("mediaDirectoryName")),
    cachePath: Path.join(process.cwd(), c.get("cacheDirectoryName")),
};

// first player will be set as the default
config.media.set(".mp4", { type: constant.types.video, players: [constant.players.h5video, constant.players.silverlight, constant.players.flash] });
config.media.set(".webm", { type: constant.types.video, players: [constant.players.h5video] });
config.media.set(".wmv", { type: constant.types.video, players: [constant.players.silverlight] });
config.media.set(".flv", { type: constant.types.video, players: [constant.players.flash] });
config.media.set(".m4a", { type: constant.types.audio, players: [constant.players.h5audio, constant.players.silverlight] });
config.media.set(".mp3", { type: constant.types.audio, players: [constant.players.h5audio, constant.players.silverlight] });
for (let extConfig of config.media.values()) {
    extConfig.players.push(constant.players.none);
}

config.demuxers.set(".mp4", {
    outputExt: ".m4a",
    exec: "D:\\Sync\\Software\\efMediaConverter\\enc\\mp4box\\mp4box.exe",
    getArgs: function (input, output) { return ["-add", input + "#audio", "-new", output]; }
});
config.demuxers.set(".webm", {
    outputExt: ".weba",
    exec: "D:\\Sync\\Software\\efMediaConverter\\enc\\mkvtoolnix\\mkvmerge.exe",
    getArgs: function (input, output) { return ["-o", output, "-a", "1", "-D", "-S", "-T", "--no-global-tags", "--no-chapters", input]; }
});
config.subtitleConv = {
    outputExt: ".vtt",
    exec: "D:\\Sync\\Software\\efMediaConverter\\enc\\efTools\\ass2srt.exe",
    getArgs: function (input, output) { return ["-i", input, "-o", output, "-f", "-vtt"]; }
};

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