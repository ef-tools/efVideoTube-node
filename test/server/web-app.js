'use strict'
require("co-mocha");
let assert = require("assert");
let request = require("co-supertest");
let webApp = require("../../web-app");
let User = require("../../models/user");

let server = webApp.listen();
let agent = request.agent(server);

describe("Test server routes", function () {
    it("should get homepage", function* () {
        yield agent.get("/").expect(200).end();
    });

    describe("Test signing in", function () {
        let userName = "erich_test";
        let password = "pwd";
        let user;
        
        before(function* () {
            user = new User({ userName: userName, password: password });
            yield user.save();
        });
        after(function* () {
            yield User.delete(user);
        });

        it("should get /signin page", function* () {
            yield agent.get("/signin").expect(200).end();
        });

        it("should get 401 on /index before signed in", function* () {
            yield agent.get("/index").expect(401).end();
        });

        it("should get 401 with incorrect credential", function* () {
            yield agent.post("/signin").send({ userName: userName, password: "wrong" })
                .expect(401).end();
        });

        it("should get token with correct credential", function* () {
            let result = yield agent.post("/signin").send({ userName: userName, password: password })
                .expect(200).end();
            assert(result.body.token);
        });

        it("should get access to /index with token", function* () {
            let result = yield agent.post("/signin").send({ userName: userName, password: password })
                .expect(200).end();
            yield agent.get("/index").set('Authorization', "Bearer " + result.body.token).expect(200).end();
        });

        it("should get 401 on /index with invalid scheme or token", function* () {
            let result = yield agent.post("/signin").send({ userName: userName, password: password })
                .expect(200).end();
            yield agent.get("/index").set('Authorization', "Basic " + result.body.token).expect(401).end();
        });
    });
});
