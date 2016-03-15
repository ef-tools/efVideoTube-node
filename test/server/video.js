'use strict'
require("co-mocha");
let assert = require("assert");
let util = require("util");
let Path = require("path");
let _ = require("lodash");
let mockFs = require('mock-fs');
let webApp = require("../../web-app");
let User = require("../../models/user");
let Setting = require("../../models/setting");
let agentFactory = require("../../utils/agent-factory");
let config = require("../../config");
let constant = require("../../constant");
let mock = require("../mock");

describe("Test /video api", function () {
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
        yield User.deleteByUserName(user.userName);
        yield Setting.deleteByUserName(user.userName);
        mockFs.restore();
    });

    it("should get 401 without token", function* () {
        yield agentFactory(server).get(constant.urls.video).expect(401).end();
    });

    it("should get 400 on invalid file type", function* () {
        yield agent.get(constant.urls.video).query({ path: "「アニメ最萌トーナメント2007」本選開幕記念MAD：「はならんまん」.avi" }).expect(400).end();
    });

    it("should get 404 on invalid path", function* () {
        yield agent.get(constant.urls.video).query({ path: "not exist.mp4" }).expect(404).end();
    });

    it("should get play info for media", function* () {
        let path = Path.join("Video", "ACG", "secret base ～君がくれたもの～.mp4");
        let parentPath = Path.dirname(path);
        yield agent.get(constant.urls.video).query({ path: path }).expect(200, {
            name: Path.basename(path),
            video: "/Media/Video/ACG/secret base ～君がくれたもの～.mp4",
            subtitles: [],
            parent: {
                name: Path.basename(parentPath),
                path: parentPath
            }
        }).end();
    });
});