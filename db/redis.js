'use strict'
let redis = require('thunk-redis');
let config = require("../config");

let client = redis.createClient(config.redis.port, config.redis.host, { database: config.redis.db });

module.exports = {
    findByUserName: function* (tableName, userName) {
        let model = null;
        let id = getKey(tableName, userName);
        let res = yield client.get(id);
        if (res !== null) {
            model = JSON.parse(res);
            model.id = id;
        }
        return model;
    },
    deleteByUserName: function* (tableName, userName) {
        let id = getKey(tableName, userName);
        yield client.del(id);
    },
    save: function* (tableName, model, modelValues) {
        let id = getKey(tableName, modelValues.userName);
        yield client.set(id, JSON.stringify(modelValues));
        model.id = id;
    },
    close: function* () {
        yield client.quit();
    }
};

function getKey(tableName, key) {
    return `${tableName}:${key}`;
}