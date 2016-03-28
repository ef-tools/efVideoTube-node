'use strict'
var r = require("../db/rethinkdb").r;

exports.up = function(next) {
    r.tableCreate("users").run(next);
};

exports.down = function(next) {
    r.tableDrop("users").run(next);
};
