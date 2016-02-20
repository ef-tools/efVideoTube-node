var request = require("co-supertest");
var koa = require("koa");
var session = require("./session");
require("co-mocha");

var app = koa();

app.keys = ["key"];

app.use(session());

app.use(function* () {
    switch (this.request.url) {
        case "/setname":
            this.session.userName = "ef";
            this.body = this.session.userName;
            break;
        case "/getname":
            this.body = this.session.userName;
            break;
        case "/clear":
            this.session = null;
            this.status = 204;
            break;
    }
});

var server = app.listen();

describe("Test server", function () {
    describe("Set session value", function () {
        var agent;
        before(function* () {
            agent = request.agent(server);
        });
        it("Should set session value", function* () {
            yield agent.get("/setname").expect(200).end();
        });
    });

    describe("Get session value", function () {
        var agent;
        before(function* () {
            agent = request.agent(server);
            yield agent.get("/setname").expect(200).end();
        });
        it("Should get session value", function* () {
            yield agent.get("/getname").expect("ef").end();
        });
        it("Should destroy session", function* () {
            yield agent.del("/clear").expect(204).end();
        });
        it("Should has no session value", function* () {
            yield agent.get("/getname").expect("").end();
        });
    });
});