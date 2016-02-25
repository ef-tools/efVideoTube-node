var _ = require("lodash");
var bcrypt = require("co-bcryptjs");
var r = require("../utils/rethinkdb")();

const SCHEMA = ["userName", "password"];

var table = r.table("users");

function* saltedHash(password) {
    var salt = yield bcrypt.genSalt(8);
    return yield bcrypt.hash(password, salt);
};

var User = function (properties) {
    _.assign(this, properties);
    this.plainPassword = true;
};

User.findByUserName = function* (userName) {
    var user;
    var result = yield table.filter({ userName: userName });
    if (result && result.length) {
        user = result[0];
        Object.setPrototypeOf(user, User.prototype);
    }
    return user;
};

User.delete = function* (userName) {
    yield table.filter({ userName: userName }).delete();
};

User.prototype.hashPassword = function* () {
    if (this.plainPassword) {
        this.plainPassword = false;
        this.password = yield saltedHash(this.password);
    }
};

User.prototype.validate = function* (password) {
    if (this.plainPassword)
        return password === this.password;

    return yield bcrypt.compare(password, this.password);
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
