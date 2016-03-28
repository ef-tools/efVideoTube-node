'use strict'
let _ = require("lodash");
let bcrypt = require("co-bcryptjs");
let db = require("../db/db-adapter");

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
    let user = yield* db.find(TABLE_NAME, userName, "userName");
    if (user) {
        Object.setPrototypeOf(user, User.prototype);
    }
    return user;
};

User.deleteByUserName = function* (userName) {
    yield* db.remove(TABLE_NAME, userName, "userName");
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
    yield* db.save(TABLE_NAME, this, SCHEMA);
};

module.exports = User;
