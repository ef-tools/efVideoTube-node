'use strict'
require("co-mocha");
let assert = require("assert");
let User = require("../../models/user");

describe("Test user model", function () {
    let userName = "erich_test";
    let password = "pwd";

    afterEach(function* () {
        yield* User.deleteByUserName(userName);
    });

    it("should create a user", function* () {
        let user = new User();
        assert.strictEqual(typeof user, "object");
    });

    it("should assign fields", function* () {
        let user = new User({ userName: userName });
        assert.strictEqual(user.userName, userName);
    });

    it("should have id after being saved to db", function* () {
        let user = new User({ userName: userName, password: password });
        yield* user.save();
        assert(user.id);
    });

    it("should find a saved user by userName", function* () {
        let user = new User({ userName: userName, password: password });
        yield* user.save();
        let dbUser = yield* User.findByUserName(userName);
        assert(dbUser instanceof User);
        assert.strictEqual(dbUser.userName, userName);
    });

    it("should delete a user", function* () {
        let user = new User({ userName: userName, password: password });
        yield* user.save();
        yield* User.deleteByUserName(userName);
        let dbUser = yield* User.findByUserName(userName);
        assert.strictEqual(dbUser, null);
    });

    it("should have a hashed password", function* () {
        let user = new User({ userName: userName, password: password });
        yield* user.save();
        assert.notEqual(user.password, password);
    });

    it("should have same hashed password", function* () {
        let user = new User({ userName: userName, password: password });
        yield* user.save();
        let dbUser = yield* User.findByUserName(userName);
        assert.strictEqual(dbUser.password, user.password);
    });

    it("should be valid with correct pwd", function* () {
        let user = new User({ userName: userName, password: password });
        assert.strictEqual(yield* user.validate(password), true);
        yield* user.save();
        assert.strictEqual(yield* user.validate(password), true);
    });

    it("should be invalid with wrong pwd", function* () {
        let user = new User({ userName: userName, password: password });
        yield* user.save();
        assert.strictEqual(yield* user.validate(password + "w"), false);
    });
});