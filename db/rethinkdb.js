'use strict'
let _ = require("lodash");
let rethinkdb = require("rethinkdbdash");
let config = require("../config");

let r = rethinkdb(config.rethinkdb);

module.exports = {
    r: r,
    find: function* (tableName, value, indexName) {
        let model = null;
        let result = yield r.table(tableName).getAll(value, { index: indexName });
        if (result && result.length) {
            model = result[0];
        }
        return model;
    },
    remove: function* (tableName, value, indexName) {
        yield r.table(tableName).getAll(value, { index: indexName }).delete();
    },
    save: function* (tableName, model, schema) {
        let modelValues = _.pick(model, schema);
        let result;
        if (model.id) {
            result = yield r.table(tableName).get(model.id).update(modelValues);
        }
        else {
            result = yield r.table(tableName).insert(modelValues);
            if (result && result.inserted) {
                model.id = result.generated_keys[0];
            }
        }
    },
    close: function () {
        r.getPoolMaster().drain();
    }
};
