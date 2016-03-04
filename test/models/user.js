'use strict'
require("co-mocha");
let assert = require("assert");
let User = require("../../models/user");

describe("Test user model", function () {
    let userName = "erich_test";
    let password = "pwd";
    
    after(function* () {
        yield User.deleteByUserName(userName);
    });

    it("should create a user", function* () {
        let user = new User();
        assert.equal("object", typeof user);
    });

    it("should assign fields", function* () {
        let user = new User({ userName: userName });
        assert.equal(userName, user.userName);
    });

    it("should have id after being saved to db", function* () {
        let user = new User({ userName: userName, password: password });
        yield user.save();
        assert(user.id);
    });

    it("should find a saved user by userName", function* () {
        let user = new User({ userName: userName, password: password });
        yield user.save();
        let dbUser = yield User.findByUserName(userName);
        assert(userName, dbUser.userName);
        assert(dbUser instanceof User);
    });

    it("should have a hashed password", function* () {
        let user = new User({ userName: userName, password: password });
        yield user.save();
        assert.notEqual(password, user.password);
    });

    it("should have same hashed password", function* () {
        let user = new User({ userName: userName, password: password });
        yield user.save();
        let dbUser = yield User.findByUserName(userName);
        assert(user.userName, dbUser.userName);
    });

    it("should be valid with correct pwd", function* () {
        let user = new User({ userName: userName, password: password });
        assert(yield user.validate(password));
        yield user.save();
        assert(yield user.validate(password));
    });
});