var assert = require("assert");
var request = require("co-supertest");
var webApp = require("../web-app");

require("co-mocha");

var server = webApp.listen();
var agent = request.agent(server);

describe("Test server pages", function () {
    it("should get homepage", function* () {
        yield agent.get("/").expect(200).end();
    });

    it("should get 401 without logged in", function* () {
        yield agent.get("/secure").expect(401).end();
    });
});
