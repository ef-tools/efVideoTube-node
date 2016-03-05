'use strict'
require("co-mocha");
let assert = require("assert");
let util = require("util");
let request = require("co-supertest");
let webApp = require("../../web-app");
let User = require("../../models/user");
let agentFactory = require("../../utils/agent-factory");
let constant = require("../../constant");

describe("Test private APIs", function* () {
    let user, agent, token;

    before(function* () {
        let userName = "erich_test";
        let password = "pwdpwd";
        user = new User({ userName: userName, password: password });
        yield user.save();

        let server = webApp.listen();
        agent = agentFactory(server);
        token = yield agent.post(constant.urls.signin).send({ userName: userName, password: password })
            .expect(200).end().body.token;
    });
    after(function* () {
        yield User.delete(user.userName);
    });

    describe("Test /settings api", function () {
        it("should get 401 without token", function* () {
            yield agent.get(constant.urls.settings).expect(401).end();
        });

        it("should get settings with token", function* () {
            agent.headers["Authorization"] = util.format("Bearer %s", token);
            let body = yield agent.get(constant.urls.settings).expect(200).end().body;
            assert(body);
        });
    });

});