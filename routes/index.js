'use strict'
let fs = require("fs");
let Path = require("path");
let _ = require("lodash");
let bluebird = require("bluebird");
let Setting = require("../models/setting");
let helper = require("../utils/helper");
let config = require("../config");
let constant = require("../constant");

bluebird.promisifyAll(fs);

module.exports = {
    get: function* () {
        let relativePath = this.query.dir || "";
        let absolutePath = Path.join(config.mediaPath, relativePath);
        let itemNames;
        try {
            itemNames = yield fs.readdirAsync(absolutePath);
        } catch (e) {
            this.throw(404);
        }
        let setting = yield* Setting.findByUserName(this.claims.userName);
        setting = Setting.injectDefaults(setting);

        let webModel = {
            name: Path.basename(relativePath),
            path: relativePath,
            dirs: [],
            files: []
        };
        helper.setParent(webModel, relativePath);
        for (let i of itemNames) {
            let isDir = (yield fs.statAsync(Path.join(absolutePath, i))).isDirectory();
            if (isDir) {
                webModel.dirs.push({
                    name: i,
                    path: Path.join(relativePath, i)
                });
            }
            else {
                let ext = Path.extname(i).toLowerCase();
                if (config.media.has(ext) && setting.media[ext] !== constant.players.none) {
                    let types = [];
                    if (config.media.get(ext).type === constant.types.video)
                        types.push(constant.types.video);
                    if (helper.hasAudio(ext))
                        types.push(constant.types.audio);
                    webModel.files.push({
                        name: i,
                        path: Path.join(relativePath, i),
                        types: types
                    });
                }
            }
        }
        this.body = webModel;
    }
};