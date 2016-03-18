'use strict'
let parse = require("co-body");
let jwt = require("jsonwebtoken");
let _ = require("lodash");
let User = require("../../models/user");
let config = require("../../config");

module.exports = {
    post: function* () {
        let body = yield parse(this);
        let user = yield* User.findByUserName(body.userName);
        if (user && (yield* user.validate(body.password))) {
            let claims = _.pick(user, ["id", "userName"]);
            this.body = {
                token: jwt.sign(claims, config.secret)
            };
        }
        else
            this.throw(400, "Invalid user credentials.");
    }
};