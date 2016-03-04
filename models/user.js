'use strict'
let _ = require("lodash");
let bcrypt = require("co-bcryptjs");
let r = require("../utils/rethinkdb")();

const SCHEMA = ["userName", "password"];

let table = r.table("users");

function* saltedHash(password) {
    let salt = yield bcrypt.genSalt(8);
    return yield bcrypt.hash(password, salt);
};

let User = function (properties) {
    _.assign(this, properties);
    this.plainPassword = true;
};

User.findByUserName = function* (userName) {
    let user;
    let result = yield table.filter({ userName: userName });
    if (result && result.length) {
        user = result[0];
        Object.setPrototypeOf(user, User.prototype);
    }
    return user;
};

User.delete = function* (user) {
    if (user.id)
        yield table.get(user.id).delete();
};

User.deleteByUserName = function* (userName) {
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
    let model = _.pick(this, SCHEMA);
    let result;
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
