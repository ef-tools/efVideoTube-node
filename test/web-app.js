// require("./user");

require("co-mocha");
var assert = require("assert");
var request = require("co-supertest");
var webApp = require("../web-app");
var User = require("../models/user");
var r = require("../utils/rethinkdb")();

var server = webApp.listen();
var agent = request.agent(server);

describe("Test server routes", function () {
    it("should get homepage", function* () {
        yield agent.get("/").expect(200).end();
    });

    it("should get 401 without logged in", function* () {
        yield agent.get("/secure").expect(401).end();
    });

    describe("Test signing in", function () {
        var userName = "erich_test";
        before(function* () {
            var password = "pwd";
            var user = new User({ userName: userName, password: password });
            yield user.save();
        });
        after(function* () {
            yield r.table("users").filter({ userName: userName }).delete();
        });

        it("should get sign in page", function* () {
            yield agent.get("/signin").expect(200).end();
        });
    });
});
