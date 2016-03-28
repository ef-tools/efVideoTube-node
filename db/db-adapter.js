'use strict'
let _ = require("lodash");
let config = require("../config");
let constant = require("../constant");

let db, adapter;
switch (config.db) {
    case constant.db.redis:
        db = require("./redis");
        adapter = {
            findByUserName: function* (tableName, userName) {
                return yield* db.findByUserName(tableName, userName);
            },
            deleteByUserName: function* (tableName, userName) {
                yield* db.deleteByUserName(tableName, userName);
            }
        };
        break;
    case constant.db.rethinkdb:
        const INDEX = "userName";
        db = require("./rethinkdb");
        adapter = {
            findByUserName: function* (tableName, userName) {
                return yield* db.find(tableName, INDEX, userName);
            },
            deleteByUserName: function* (tableName, userName) {
                yield* db.remove(tableName, INDEX, userName);
            }
        };
        break;
    default:
        throw new Error(config.db + " is not supported by db adapter.");
}

adapter.save = function* (tableName, model, schema) {
    let modelValues = _.pick(model, schema);
    yield* db.save(tableName, model, modelValues);
};
adapter.close = function* () {
    yield* db.close();
};
module.exports = adapter;
