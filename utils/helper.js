'use strict'
let util = require("util");
let Path = require("path");
let constant = require("../constant");

module.exports = {
    getMediaUrl: function (path) {
        return util.format("/%s/%s", constant.mediaDirectoryName, path.split("\\").join("/"));
    },
    setParent: function (webModel, relativePath) {
        let parentPath = Path.dirname(relativePath);
        if (parentPath !== ".")
            webModel.parent = {
                name: Path.basename(parentPath),
                path: parentPath
            };
    }
};