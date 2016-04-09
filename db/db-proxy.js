'use strict'
let _ = require("lodash");
let config = require("../config");
let constant = require("../constant");

let dbClient;
let findByUserName, deleteByUserName;
switch (config.dbType) {
    case constant.db.redis:
        dbClient = require("./redis");
        findByUserName = function* (tableName, userName) {
            return yield* dbClient.findByUserName(tableName, userName);
        };
        deleteByUserName = function* (tableName, userName) {
            yield* dbClient.deleteByUserName(tableName, userName);
        };
        break;
    case constant.db.rethinkdb:
        const INDEX = "userName";
        dbClient = require("./rethinkdb");
        findByUserName = function* (tableName, userName) {
            return yield* dbClient.find(tableName, INDEX, userName);
        };
        deleteByUserName = function* (tableName, userName) {
            yield* dbClient.remove(tableName, INDEX, userName);
        };
        break;
    default:
        throw new Error(`"${config.dbType}" is not supported by db adapter.`);
}

module.exports = {
    findByUserName,
    deleteByUserName,
    save: function* (tableName, model, schema) {
        let modelValues = _.pick(model, schema);
        yield* dbClient.save(tableName, model, modelValues);
    },
    close: function* () {
        yield* dbClient.close();
    }
};
