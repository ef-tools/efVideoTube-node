'use strict'
var r = require("../utils/rethinkdb")();
var config = require("../config");

exports.up = function (next) {
    r.dbCreate(config.rethinkdb.db)
        .run(next);
};

exports.down = function (next) {
    r.dbDrop(config.rethinkdb.db)
        .run(next);
};
