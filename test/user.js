var assert = require("assert");
var User = require("../models/user");
require("co-mocha");

describe("Test user model", function () {
    it("should create a user", function* () {
        var user = new User();
        assert.equal(typeof user, "object");
    });

    it("should assign fields", function* () {
        var name = "erich";
        var user = new User({ userName: name });
        assert.equal(user.userName, name);
    });

    it("should have id after being saved to db", function* () {
        var name = "erich";
        var password = "pwd";
        var user = new User({ userName: name, password: password });
        yield user.save();
        assert(user.id);
    });

    it("should find a saved user by user name", function* () {
        var name = "erich";
        var password = "pwd";
        var user = new User({ userName: name, password: password });
        yield user.save();
        var dbUser = yield User.findByUserName(name);
        assert(dbUser.userName, name);
    });
});