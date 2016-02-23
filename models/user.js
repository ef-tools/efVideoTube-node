var _ = require("lodash");
var bcrypt = require("co-bcryptjs");
var r = require("../utils/rethinkdb")();

const SCHEMA = ["userName", "password"];

var table = r.table("users");

function* hashPassword(password) {
    var salt = yield bcrypt.genSalt(8);
    yield bcrypt.hash(password, salt);
};

var User = function (properties) {
    this.init();
    _.assign(this, properties);
    this.plainPassword = true;
};

User.findByUserName = function* (userName) {
    var user;
    var result = yield table.filter({ userName: userName });
    if (result && result.length) {
        user = result[0];
    }
    return user;
};

User.prototype.init = function () {
    Object.defineProperty(this, 'password', {
        get: function () {
            return this._password;
        },
        set: function (password) {
            this._password = password;
        }
    });
};

User.prototype.hashPassword = function* () {
    if (this.plainPassword) {
        this.plainPassword = false;
        this.password = yield hashPassword(this.password);
    }
};

User.prototype.save = function* () {
    yield this.hashPassword();
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
