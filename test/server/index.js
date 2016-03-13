'use strict'
require("co-mocha");
let assert = require("assert");
let util = require("util");
let path = require('path');
let _ = require("lodash");
let mockFs = require('mock-fs');
let webApp = require("../../web-app");
let User = require("../../models/user");
let agentFactory = require("../../utils/agent-factory");
let config = require("../../config");
let constant = require("../../constant");
let mock = require("../mock");

assert.equalCaseInsensitive = function (actual, expected) {
    assert.equal(actual.toUpperCase(), expected.toUpperCase());
};

describe("Test /index api", function () {
    let server = webApp.listen();
    let user, agent;

    before(function* () {
        let userName = "erich_test";
        let password = "pwdpwd";
        user = new User({ userName: userName, password: password });
        yield user.save();

        agent = agentFactory(server);
        let result = yield agent.post(constant.urls.signin).send({ userName: userName, password: password }).expect(200).end()
        agent.headers["Authorization"] = util.format("Bearer %s", result.body.token);

        mockFs(mock.fs);
    });
    after(function* () {
        yield User.delete(user.userName);
        mockFs.restore();
    });

    it("should get 401 without token", function* () {
        yield agentFactory(server).get(constant.urls.index).expect(401).end();
    });

    it("should get root structure by default", function* () {
        let resultRoot = yield agent.get(constant.urls.index).query({ path: "" }).expect(200).end();
        let resultDefault = yield agent.get(constant.urls.index).expect(200).end();
        assert.deepStrictEqual(resultDefault.body, resultRoot.body);
    });

    it("should get file system structure", function* () {
        let nodes = [mock.fs.Media];
        nodes[0]["?name"] = nodes[0]["?path"] = "";
        for (let i = 0; i < nodes.length; i++) {
            let fs = nodes[i];
            let items = Object.keys(fs);
            items.sort();
            let dirNames = items.filter(i => typeof fs[i] !== "string");
            let fileNames = items.filter(i => typeof fs[i] === "string" && !i.startsWith("?"));

            let result = yield agent.get(constant.urls.index).query({ path: fs["?path"] }).expect(200).end();
            assert.equalCaseInsensitive(result.body.name, fs["?name"]);
            assert.equalCaseInsensitive(result.body.path, fs["?path"]);
            assert.deepStrictEqual(result.body.dirs.map(d => d.name), dirNames);
            assert.deepStrictEqual(result.body.files.map(d => d.name), fileNames);

            dirNames.forEach(d => {
                fs[d]["?name"] = d;
                fs[d]["?path"] = path.join(fs["?path"], d);
                nodes.push(fs[d]);
            });
        }
    });
});