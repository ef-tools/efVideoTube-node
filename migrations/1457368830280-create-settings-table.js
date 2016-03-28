'use strict'
var r = require("../db/rethinkdb").r;

exports.up = function(next) {
    r.tableCreate("settings").run(next);
};

exports.down = function(next) {
    r.tableDrop("settings").run(next);
};