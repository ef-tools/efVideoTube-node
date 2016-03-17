'use strict'
let util = require("util");
let Path = require("path");
let _ = require("lodash");
let config = require("../config");
let constant = require("../constant");

module.exports = {
    getMediaUrl: function (path) {
        return util.format("/%s/%s", config.mediaDirectoryName, path.split("\\").join("/"));
    },
    getMediaType: function (ext) {
        switch (ext) {
            case ".mp4":
            case ".webm":
            case ".wmv":
            case ".flv":
                return constant.types.video;
            case ".m4a":
            case ".mp3":
                return constant.types.audio;
        }
    },
    canExtract: function (ext) {
        return _.includes(config.splittableExts, ext);
    },
    hasAudio: function (ext) {
        return this.getMediaType(ext) == constant.types.audio || this.canExtract(ext);
    },
    setParent: function (webModel, relativePath) {
        let parentPath = Path.dirname(relativePath);
        if (parentPath !== ".")
            webModel.parent = {
                name: Path.basename(parentPath),
                path: parentPath
            };
    },
    parseLang: function (fileName) {
        let fileNameWithoutExt = Path.basename(fileName, Path.extname(fileName));
        for (let langExt of config.subtitleLangs.keys()) {
            if (fileNameWithoutExt.toLowerCase().endsWith(langExt))
                return config.subtitleLangs.get(langExt);
        }
        return config.langs[0];
    }
};