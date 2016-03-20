'use strict'
require("co-mocha");
let assert = require("assert");
let request = require("co-supertest");
let webApp = require("../../web-app");
let User = require("../../models/user");
let constant = require("../../constant");

describe("Test server routes", function () {
    let server = webApp.listen();
    let agent = request.agent(server);

    it("should get homepage", function* () {
        yield agent.get("/").expect(200).end();
    });

    describe("Test signing in", function () {
        let userName = "erich_test";
        let password = "pwd";
        let user;

        before(function* () {
            user = new User({ userName: userName, password: password });
            yield* user.save();
        });
        after(function* () {
            yield User.delete(user);
        });

        it("should get 401 on /settings before signed in", function* () {
            yield agent.get(constant.urls.settings).expect(401).end();
        });

        it("should get 401 with incorrect credential", function* () {
            yield agent.post(constant.urls.signin).send({ userName: userName, password: "wrong" }).expect(400).end();
        });

        it("should get token with correct credential", function* () {
            let result = yield agent.post(constant.urls.signin).send({ userName: userName, password: password }).expect(200).end();
            assert(result.body.token);
        });

        it("should get access to /settings with token", function* () {
            let result = yield agent.post(constant.urls.signin).send({ userName: userName, password: password }).expect(200).end();
            yield agent.get(constant.urls.settings).set("Authorization", "Bearer " + result.body.token).expect(200).end();
        });

        it("should get 401 on /settings with invalid scheme or token", function* () {
            let result = yield agent.post(constant.urls.signin).send({ userName: userName, password: password }).expect(200).end();
            yield agent.get(constant.urls.settings).set("Authorization", "Basic " + result.body.token).expect(401).end();
            yield agent.get(constant.urls.settings).set("Authorization", "Bearer " + result.body.token + "wrong").expect(401).end();
        });
    });
});
