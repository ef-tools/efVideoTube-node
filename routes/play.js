'use strict'
let util = require("util");
let fs = require("fs");
let Path = require("path");
let childProcess = require('child_process');
let _ = require("lodash");
let bluebird = require("bluebird");
let Setting = require("../models/setting");
let helper = require("../utils/helper");
let config = require("../config");
let constant = require("../constant");

bluebird.promisifyAll(fs);
bluebird.promisifyAll(childProcess);

let parsePathes = function* (validExts) {
    let relativePath = this.query.path || "";
    let ext = Path.extname(relativePath).toLowerCase();
    let isExtValid = false;
    switch (typeof validExts) {
        case "Map":
            isExtValid = validExts.has(ext);
            break;
        case "Array":
            isExtValid = _.includes(validExts, ext);
            break;
        default:
            this.throw(500);
    }
    if (!isExtValid)
        this.throw(400);
    let absolutePath = Path.join(config.mediaPath, relativePath);
    try {
        let stat = yield fs.statAsync(absolutePath);
        if (stat.isDirectory())
            this.throw(507);
    } catch (e) {
        this.throw(404);
    }
    return [relativePath, ext, absolutePath];
};

let getLangSubtitleMaps = function* (relativePath, ext, itemNames) {
    let parentRelativePath = Path.dirname(relativePath);
    let nameWithoutExt = Path.basename(relativePath, ext);
    let pattern = new RegExp(util.format("^%s.+?(%s)$", nameWithoutExt, config.subtitleExts.join("|")), "i");
    let langSubtitles = new Map();
    for (let itemName of itemNames) {
        let itemRelativePath = Path.join(parentRelativePath, itemName);
        if (!(yield fs.statAsync(Path.join(config.mediaPath, itemRelativePath))).isDirectory() && pattern.test(itemName)) {
            let lang = helper.parseLang(itemName);
            if (!langSubtitles.has(lang))
                langSubtitles.set(lang, []);
            langSubtitles.get(lang).push({
                src: util.format("%s?path=%s", constant.urls.subtitle, encodeURIComponent(itemRelativePath)),
                srclang: lang.srcLang,
                label: lang.label
            });
        }
    }
    return langSubtitles;
};

let redirectToCache = function* (relativePath, absolutePath, demuxer) {
    let cacheRelativePath = relativePath + demuxer.outputExt;
    let cacheAbsolutePath = Path.join(config.cachePath, cacheRelativePath);
    let exists = true;
    try {
        let stat = yield fs.statAsync(cacheAbsolutePath);
        if (stat.isDirectory())
            this.throw(507);
    } catch (e) {
        exists = false;
    }
    if (!exists)
        yield childProcess.execFileAsync(demuxer.exec, demuxer.getArgs(absolutePath, cacheAbsolutePath));
    this.redirect(helper.getMediaCacheUrl(cacheRelativePath));
}

module.exports = {
    get: function* () {
        let pathes = yield parsePathes(config.media);
        let relativePath = pathes[0];
        let ext = pathes[1];
        let absolutePath = pathes[2];

        let setting = yield Setting.findByUserName(this.claims.userName);
        setting = Setting.injectDefaults(setting);

        let mediaType = config.media.get(ext).type;
        let webModel = {
            player: setting.media[ext],
            name: Path.basename(relativePath, Path.extname(relativePath))
        };
        webModel[mediaType] = helper.getMediaUrl(relativePath);
        helper.setParent(webModel, relativePath);
        if (mediaType === constant.types.video) {
            let langSubMap = yield getLangSubtitleMaps(relativePath, ext, yield fs.readdirAsync(Path.dirname(absolutePath)));
            webModel.subtitles = _.flatMap(config.langs, v => {
                return langSubMap.has(v) ? langSubMap.get(v) : [];
            });
            if (webModel.subtitles.length)
                webModel.subtitles[0].default = true;
            if (config.demuxers.has(ext))
                webModel[constant.types.audio] = util.format("%s?path=%s",
                    constant.urls.audio, encodeURIComponent(relativePath));
        }
        this.body = webModel;
    },
    audio: function* () {
        let pathes = yield parsePathes(config.demuxers);
        let relativePath = pathes[0];
        let ext = pathes[1];
        let absolutePath = pathes[2];

        yield redirectToCache(relativePath, absolutePath, config.demuxers.get(ext));
    },
    subtitle: function* () {
        let pathes = yield parsePathes(config.subtitleExts);
        let relativePath = pathes[0];
        let absolutePath = pathes[2];

        yield redirectToCache(relativePath, absolutePath, config.subtitleConv);
    }
};