'use strict'
var r = require("../utils/rethinkdb")();

exports.up = function(next) {
    r.table("users").indexCreate("userName").run(next);
    r.table("settings").indexCreate("userName").run(next);
};

exports.down = function(next) {
    r.table("users").indexDrop("userName").run(next);
    r.table("settings").indexDrop("userName").run(next);
};
