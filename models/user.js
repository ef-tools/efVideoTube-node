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
    let user = yield* db.findByUserName(TABLE_NAME, userName);
    if (user) {
        Object.setPrototypeOf(user, User.prototype);
    }
    return user;
};

User.deleteByUserName = function* (userName) {
    yield* db.deleteByUserName(TABLE_NAME, userName);
};

User.prototype.validate = function* (password) {
    if (this.plainPassword)
        return password === this.password;

    return yield bcrypt.compare(password, this.password);
};

User.prototype.save = function* () {
    if (this.plainPassword) {
        this.password = yield* saltedHash(this.password);
        this.plainPassword = false;
    }
    yield* db.save(TABLE_NAME, this, SCHEMA);
};

module.exports = User;
