'use strict'
let jwt = require("jsonwebtoken");
let config = require("../config");

module.exports = function* (next) {
    let authHeader = this.get("Authorization");
    if (authHeader) {
        let parts = authHeader.split(" ");
        if (parts.length === 2 && parts[0] === "Bearer") {
            let token = parts[1];
            try {
                this.claims = jwt.verify(token, config.secret);
            } catch (err) { }
        }
    }
    yield next;
};