var assert = require("assert");
var User = require("../models/user");
require("co-mocha");

describe("Test user model", function () {
    it("should create a user", function* () {
        var user = new User();
        assert.equal(typeof user, "object");
    });

    it("should assign fields", function* () {
        var user = new User({ name: "Erich" });
        assert.equal(user.name, "Erich");
    });
})