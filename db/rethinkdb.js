'use strict'
let rethinkdb = require("rethinkdbdash");
let config = require("../config");

let r = rethinkdb(config.rethinkdb);

module.exports = {
    find: function* (tableName, index, value) {
        let model = null;
        let result = yield r.table(tableName).getAll(value, { index: index });
        if (result && result.length) {
            model = result[0];
        }
        return model;
    },
    remove: function* (tableName, index, value) {
        yield r.table(tableName).getAll(value, { index: index }).delete();
    },
    save: function* (tableName, model, modelValues) {
        if (model.id) {
            yield r.table(tableName).get(model.id).update(modelValues);
        }
        else {
            let result = yield r.table(tableName).insert(modelValues);
            if (result && result.inserted) {
                model.id = result.generated_keys[0];
            }
        }
    },
    close: function* () {
        r.getPoolMaster().drain();
    },
    r: r
};
