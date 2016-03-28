'use strict'
var r = require("../db/rethinkdb").r;
var config = require("../config");

exports.up = function(next) {
    r.dbCreate(config.rethinkdb.db).run(next);
};

exports.down = function(next) {
    r.dbDrop(config.rethinkdb.db).run(next);
};
