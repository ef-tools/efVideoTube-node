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

let parsePathes = function* (ctx, validExts) {
    let relativePath = ctx.query.path || "";
    let ext = Path.extname(relativePath).toLowerCase();
    let isExtValid = false;
    if (validExts instanceof Map)
        isExtValid = validExts.has(ext);
    else if (validExts instanceof Array)
        isExtValid = _.includes(validExts, ext);
    else
        ctx.throw(500);

    if (!isExtValid)
        ctx.throw(400);
    let absolutePath = Path.join(config.mediaPath, relativePath);
    try {
        let stat = yield fs.statAsync(absolutePath);
        if (stat.isDirectory())
            ctx.throw(507);
    } catch (e) {
        ctx.throw(404);
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

let redirectToCache = function* (ctx, relativePath, absolutePath, demuxer) {
    let cacheRelativePath = relativePath + demuxer.outputExt;
    let cacheAbsolutePath = Path.join(config.cachePath, cacheRelativePath);
    let exists = true;
    try {
        let stat = yield fs.statAsync(cacheAbsolutePath);
        if (stat.isDirectory())
            ctx.throw(507);
    } catch (e) {
        exists = false;
    }
    if (!exists)
        yield childProcess.execFileAsync(demuxer.exec, demuxer.getArgs(absolutePath, cacheAbsolutePath));
    ctx.redirect(helper.getMediaCacheUrl(cacheRelativePath));
}

module.exports = {
    get: function* () {
        let [relativePath, ext, absolutePath] = yield* parsePathes(this, config.media);
        let setting = yield* Setting.findByUserName(this.claims.userName);
        setting = Setting.injectDefaults(setting);

        let mediaType = config.media.get(ext).type;
        let webModel = {
            player: setting.media[ext],
            name: Path.basename(relativePath, Path.extname(relativePath))
        };
        webModel[mediaType] = helper.getMediaUrl(relativePath);
        helper.setParent(webModel, relativePath);
        if (mediaType === constant.types.video) {
            let langSubMap = yield* getLangSubtitleMaps(relativePath, ext, yield fs.readdirAsync(Path.dirname(absolutePath)));
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
        let [relativePath, ext, absolutePath] = yield* parsePathes(this, config.demuxers);
        yield* redirectToCache(this, relativePath, absolutePath, config.demuxers.get(ext));
    },
    subtitle: function* () {
        let [relativePath, ext, absolutePath] = yield* parsePathes(this, config.subtitleExts);
        yield* redirectToCache(this, relativePath, absolutePath, config.subtitleConv);
    }
};