'use strict'
let assert = require("assert");
let config = require("../config");

assert.equalCaseInsensitive = function (actual, expected) {
    assert.strictEqual(actual.toLowerCase(), expected.toLowerCase());
};

describe("Test on redis", function () {
    config.db = "redis";
    require("./models/user");
    require("./models/setting");
    require("./server/web-app");
    require("./server/settings");
    require("./server/index");
    require("./server/play");
});
