'use strict'
var r = require("../utils/rethinkdb")();

exports.up = function(next) {
    r.tableCreate("settings").run(next);
};

exports.down = function(next) {
    r.tableDrop("settings").run(next);
};