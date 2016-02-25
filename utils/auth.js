var jwt = require("jsonwebtoken");
var config = require("../config");

module.exports = function () {
    return function* (next) {
        var authHeader = this.get("Authorization");
        if (authHeader) {
            var parts = authHeader.split(" ");
            if (parts.length === 2 && parts[0] === "Bearer") {
                var token = parts[1];
                try {
                    this.user = jwt.verify(token, config.secret);
                } catch (err) { }
            }
        }
        yield next;
    };
};