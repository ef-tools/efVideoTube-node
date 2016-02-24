var assert = require("assert");
var request = require("co-supertest");
var webApp = require("../web-app");

require("co-mocha");

var server = webApp.listen();
var agent = request.agent(server);

describe("Page tests", function () {
    it("should get homepage", function* () {
        agent.get("/").expect(200).end();
    });
});
