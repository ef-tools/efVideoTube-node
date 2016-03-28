'use strict'
let _ = require("lodash");
let config = require("../config");

let db;
switch (config.db) {
    case "redis":
        db = require("./redis");
        break;
    case "rethinkdb":
        db = require("./rethinkdb");
        break;
    default:
        throw new Error(config.db + " is not supported by db adapter.");
}

module.exports = {
    find: function* (tableName, key) {
        return yield* db.find(tableName, key);
    },
    remove: function* (tableName, key) {
        yield* db.remove(tableName, key);
    },
    save: function* (tableName, model, schema) {
        let modelValues = _.pick(model, schema);
        yield* db.save(tableName, model, modelValues);
    },
    close: function* () {
        yield* db.close();
    }
};
