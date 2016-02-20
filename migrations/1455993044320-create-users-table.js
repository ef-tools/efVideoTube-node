'use strict'
var r = require("../utils/rethinkdb")();
var config = require("../config");

const TABLE_NAME = "users";

exports.up = function (next) {
    r.tableCreate(TABLE_NAME)
        .run(next);
};

exports.down = function (next) {
    r.tableDrop(TABLE_NAME)
        .run(next);
};
