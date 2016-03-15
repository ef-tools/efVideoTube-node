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
        let relativePath = this.query.path || "";
        if (_.includes(config.media.keys, Path.extname(relativePath))) {
            this.status = 400;
            return;
        }
        let absolutePath = Path.join(config.mediaPath, relativePath);
        try {
            yield fs.statAsync(absolutePath);
        } catch (e) {
            this.status = 404;
            return;
        }

        let webModel = {
            name: Path.basename(relativePath),
            video: helper.getMediaUrl(relativePath),
            subtitles: [],
            parent: null
        };
        helper.setParent(webModel, relativePath);
        this.body = webModel;
    }
};