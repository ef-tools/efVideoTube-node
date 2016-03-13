'use strict'
let fs = require("fs");
let Path = require("path");
let bluebird = require("bluebird");
let config = require("../config");

bluebird.promisifyAll(fs);

module.exports = {
    get: function* () {
        let relativePath = this.query.path || "";
        let absolutePath = Path.join(config.mediaPath, relativePath);
        let itemNames = yield fs.readdirAsync(absolutePath);
        let webModel = {
            name: Path.basename(relativePath),
            path: relativePath,
            dirs: [],
            files: []
        };
        for (let i of itemNames) {
            let collection = (yield fs.statAsync(Path.join(absolutePath, i))).isDirectory() ? webModel.dirs : webModel.files;
            collection.push({
                name: i,
                path: Path.join(relativePath, i)
            });
        }
        this.body = webModel;
    }
};