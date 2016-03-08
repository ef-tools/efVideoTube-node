'use strict'
var r = require("../utils/rethinkdb")();

exports.up = function(next) {
    r.tableCreate("users").run(next);
};

exports.down = function(next) {
    r.tableDrop("users").run(next);
};
