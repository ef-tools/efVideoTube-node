var rethinkdb = require("rethinkdbdash");
var config = require("../config");

module.exports = rethinkdb(config.rethinkdb);