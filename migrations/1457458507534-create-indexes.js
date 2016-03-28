'use strict'
var r = require("../db/rethinkdb").r;

exports.up = function(next) {
    r.table("users").indexCreate("userName").run(next);
    r.table("settings").indexCreate("userName").run(next);
};

exports.down = function(next) {
    r.table("users").indexDrop("userName").run(next);
    r.table("settings").indexDrop("userName").run(next);
};
