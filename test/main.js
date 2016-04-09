'use strict'
let assert = require("assert");
let config = require("../config");
let constant = require("../constant");

assert.equalCaseInsensitive = function(actual, expected) {
    assert.strictEqual(actual.toLowerCase(), expected.toLowerCase());
};

console.info(`Run tests on <${config.dbType}>`);

require("./models/user");
require("./models/setting");
require("./server/web-app");
require("./server/settings");
require("./server/index");
require("./server/play");
