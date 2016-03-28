'use strict'
let assert = require("assert");
let config = require("../config");
let constant = require("../constant");

assert.equalCaseInsensitive = function (actual, expected) {
    assert.strictEqual(actual.toLowerCase(), expected.toLowerCase());
};

let db = require("optimist").demand("config").argv.config || constant.db.redis;
describe("Test on " + db, function () {
    config.db = db;
    require("./models/user");
    require("./models/setting");
    require("./server/web-app");
    require("./server/settings");
    require("./server/index");
    require("./server/play");
});
