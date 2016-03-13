'use strict'
let fs = require("fs");
let Path = require("path");
let _ = require("lodash");
let bluebird = require("bluebird");
let Setting = require("../models/setting");
let config = require("../config");
let constant = require("../constant");

bluebird.promisifyAll(fs);

module.exports = {
    get: function* () {
        let relativePath = this.query.path || "";
        let absolutePath = Path.join(config.mediaPath, relativePath);
        let itemNames = yield fs.readdirAsync(absolutePath);
        let setting = yield Setting.findByUserName(this.claims.userName);
        setting = Setting.injectDefaults(setting);

        let webModel = {
            name: Path.basename(relativePath),
            path: relativePath,
            dirs: [],
            files: []
        };
        for (let i of itemNames) {
            let isDir = (yield fs.statAsync(Path.join(absolutePath, i))).isDirectory();
            let ext = Path.extname(i);
            if (isDir || (_.includes(Object.keys(setting.media), ext) && setting.media[ext] !== constant.players.none)) {
                let collection = isDir ? webModel.dirs : webModel.files;
                collection.push({
                    name: i,
                    path: Path.join(relativePath, i)
                });
            }
        }
        this.body = webModel;
    }
};