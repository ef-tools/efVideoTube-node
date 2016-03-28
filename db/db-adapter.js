'use strict'
let config = require("../config");

let db;
switch (config.db) {
    case "redis":
        db = require("../redis");
        break;
    case "rethinkdb":
        db = require("./rethinkdb");
        break;
    default:
        throw new Error(config.db + " is not supported by db adapter.");
}

module.exports = {
    find: function* (tableName, value, indexName) {
        return yield* db.find(tableName, value, indexName);
    },
    remove: function* (tableName, value, indexName) {
        yield* db.remove(tableName, value, indexName);
    },
    save: function* (tableName, model, schema) {
        yield* db.save(tableName, model, schema);
    },
    close: function () {
        db.close();
    }
};
