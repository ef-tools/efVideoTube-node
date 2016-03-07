'use strict'
var r = require("../utils/rethinkdb")();

const TABLE_NAME = "settings";

exports.up = function (next) {
    r.tableCreate(TABLE_NAME)
        .run(next);
};

exports.down = function (next) {
    r.tableDrop(TABLE_NAME)
        .run(next);
};