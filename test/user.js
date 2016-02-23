var assert = require("assert");
var User = require("../models/user");
var r = require("../utils/rethinkdb")();
require("co-mocha");

describe("Test user model", function () {
    var name = "erich";
    afterEach(function* () {
        yield r.table("users").filter({ userName: name }).delete();
    });

    it("should create a user", function* () {
        var user = new User();
        assert.equal("object", typeof user);
    });

    it("should assign fields", function* () {
        var user = new User({ userName: name });
        assert.equal(name, user.userName);
    });

    it("should have id after being saved to db", function* () {
        var password = "pwd";
        var user = new User({ userName: name, password: password });
        yield user.save();
        assert(user.id);
    });

    it("should find a saved user by user name", function* () {
        var password = "pwd";
        var user = new User({ userName: name, password: password });
        yield user.save();
        var dbUser = yield User.findByUserName(name);
        assert(name, dbUser.userName);
    });

    it("should have a hashed password", function* () {
        var password = "pwd";
        var user = new User({ userName: name, password: password });
        yield user.save();
        assert.notEqual(password, user.password);
    });

    it("should have same hashed password", function* () {
        var password = "pwd";
        var user = new User({ userName: name, password: password });
        yield user.save();
        var dbUser = yield User.findByUserName(name);
        assert(user.userName, dbUser.userName);
    });
});