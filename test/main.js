'use strict'
let assert = require("assert");
assert.equalCaseInsensitive = function (actual, expected) {
    assert.strictEqual(actual.toLowerCase(), expected.toLowerCase());
};

require("./models/user");
require("./models/setting");
require("./server/web-app");
require("./server/settings");
require("./server/index");
require("./server/play");