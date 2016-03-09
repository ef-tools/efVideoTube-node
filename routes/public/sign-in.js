'use strict'
let parse = require("co-body");
let jwt = require("jsonwebtoken");
let _ = require("lodash");
let User = require("../../models/user");
let config = require("../../config");

module.exports = {
    get: function () {
        return function* () {
            this.body = "sign in page";
        };
    },
    post: function () {
        return function* () {
            let body = yield parse(this);
            let user = yield User.findByUserName(body.userName);
            if (user && (yield user.validate(body.password))) {
                let claim = {
                    user: _.pick(user, ["id", "userName"])
                };
                this.body = {
                    token: jwt.sign(claim, config.secret)
                };
            }
            else
                this.throw(401, "Invalid user credentials.");
        };
    }
};