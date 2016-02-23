var _ = require("lodash");
var r = require("../utils/rethinkdb")();

const TABLE_NAME = "users";
const SCHEMA = ["userName", "password"];

var table = r.table(TABLE_NAME);

var User = function (properties) {
    _.assign(this, properties);
};

User.findByUserName = function *(userName) {
    var user;
    var result = yield table.filter({userName: userName});
    if (result && result.length){
        user = result[0];
    }
    return user;
};

User.prototype.save = function* () {
    var model = _.pick(this, SCHEMA);
    var result;
    if (this.id) {
        result = yield table.get(this.id).update(model);
    }
    else {
        result = yield table.insert(model);
        if (result && result.inserted) {
            this.id = result.generated_keys[0];
        }
    }
};

module.exports = User;
