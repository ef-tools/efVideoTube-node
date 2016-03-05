'use strict'
require("co-mocha");
let assert = require("assert");
let request = require("co-supertest");
let webApp = require("../../web-app");
let User = require("../../models/user");
let agentFactory = require("../../utils/agent-factory");

describe("Test private APIs", function* () {
    let agent, user;

    before(function* () {
        let server = webApp.listen();
        agent = agentFactory(server);
        user = new User({ userName: "erich_test", password: "pwd" });
        yield user.save();
    });
    after(function* () {
        yield User.delete(user.userName);
    });

    describe("Test /settings api", function* () {

    });

});