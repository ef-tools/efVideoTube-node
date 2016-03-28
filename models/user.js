'use strict'
let _ = require("lodash");
let bcrypt = require("co-bcryptjs");
let r = require("../utils/rethinkdb");

const TABLE_NAME = "users";
const SCHEMA = ["userName", "password"];

var saltedHash = function* (password) {
    let salt = yield bcrypt.genSalt(8);
    return yield bcrypt.hash(password, salt);
};

let User = function (properties) {
    _.assign(this, properties);
    this.plainPassword = true;
};

User.findByUserName = function* (userName) {
    let user = yield* r.find(TABLE_NAME, userName, "userName");
    if (user) {
        Object.setPrototypeOf(user, User.prototype);
    }
    return user;
};

User.deleteByUserName = function* (userName) {
    yield* r.remove(TABLE_NAME, userName, "userName");
};

User.prototype.hashPassword = function* () {
    if (this.plainPassword) {
        this.plainPassword = false;
        this.password = yield* saltedHash(this.password);
    }
};

User.prototype.validate = function* (password) {
    if (this.plainPassword)
        return password === this.password;

    return yield bcrypt.compare(password, this.password);
};

User.prototype.save = function* () {
    yield this.hashPassword();
    yield* r.save(TABLE_NAME, this, SCHEMA);
};

module.exports = User;
