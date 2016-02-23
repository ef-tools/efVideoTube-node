var rethinkdb = require("rethinkdbdash");
var config = require("../config");

var r;

module.exports = function () {
    if (!r)
        r = rethinkdb(config.rethinkdb);
    return r;
};