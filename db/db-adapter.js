'use strict'
let _ = require("lodash");
let config = require("../config");
let constant = require("../constant");

let dbClient, adapter;
switch (config.dbType) {
    case constant.db.redis:
        dbClient = require("./redis");
        adapter = {
            findByUserName: function* (tableName, userName) {
                return yield* dbClient.findByUserName(tableName, userName);
            },
            deleteByUserName: function* (tableName, userName) {
                yield* dbClient.deleteByUserName(tableName, userName);
            }
        };
        break;
    case constant.db.rethinkdb:
        const INDEX = "userName";
        dbClient = require("./rethinkdb");
        adapter = {
            findByUserName: function* (tableName, userName) {
                return yield* dbClient.find(tableName, INDEX, userName);
            },
            deleteByUserName: function* (tableName, userName) {
                yield* dbClient.remove(tableName, INDEX, userName);
            }
        };
        break;
    default:
        throw new Error(`"${config.dbType}" is not supported by db adapter.`);
}

adapter.save = function* (tableName, model, schema) {
    let modelValues = _.pick(model, schema);
    yield* dbClient.save(tableName, model, modelValues);
};
adapter.close = function* () {
    yield* dbClient.close();
};
module.exports = adapter;
