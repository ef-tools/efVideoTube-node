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
let helper = require("../../utils/helper");
let agentFactory = require("../agent-factory");
let config = require("../../config");
let constant = require("../../constant");
let mock = require("../mock");

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
        yield User.deleteByUserName(user.userName);
        mockFs.restore();
    });

    it("should get 401 without token", function* () {
        yield agentFactory(server).get(constant.urls.index).expect(401).end();
    });

    it("should get 404 on invalid path", function* () {
        yield agent.get(constant.urls.index).query({ dir: "not exist" }).expect(404).end();
    });

    it("should get root structure by default", function* () {
        let resultRoot = yield agent.get(constant.urls.index).query({ dir: "" }).expect(200).end();
        let resultDefault = yield agent.get(constant.urls.index).expect(200).end();
        assert.deepStrictEqual(resultDefault.body, resultRoot.body);
    });

    describe("Test index structure", function () {
        let setting = Setting.injectDefaults();
        let exts = Object.keys(setting.media).filter(ext => setting.media[ext] !== constant.players.none);
        let nodes = [mock.fs.Media];
        for (let i = 0; i < nodes.length; i++) {
            let item = nodes[i];
            let subItemNames = Object.keys(item);
            subItemNames.sort();
            let dirNames = subItemNames.filter(i => typeof item[i] !== "string");
            let fileNames = subItemNames.filter(i => typeof item[i] === "string" && _.includes(exts, Path.extname(i)));
            dirNames.forEach(d => { nodes.push(item[d]); });

            let itemData = mock.mediaData.get(item);
            it("should get index of " + (itemData.path || "ROOT"), function* () {
                let result = yield agent.get(constant.urls.index).query({ dir: itemData.path }).expect(200).end();
                assert.equalCaseInsensitive(result.body.name, itemData.name);
                assert.equalCaseInsensitive(result.body.path, itemData.path);
                if (itemData.parent) {
                    assert(result.body.parent);
                    assert.equalCaseInsensitive(result.body.parent.name, Path.basename(itemData.parent));
                    assert.equalCaseInsensitive(result.body.parent.path, itemData.parent);
                }
                assert.deepStrictEqual(result.body.dirs, dirNames.map(d => {
                    return { name: d, path: Path.join(itemData.path, d) };
                }));
                assert.deepStrictEqual(result.body.files, fileNames.map(f => {
                    let types = [];
                    let ext = Path.extname(f);
                    if (config.media.get(ext).type === constant.types.video)
                        types.push(constant.types.video);
                    if (helper.hasAudio(ext))
                        types.push(constant.types.audio);
                    return { name: f, path: Path.join(itemData.path, f), types: types };
                }));
            });
        }
    });

    describe("Test with settings", function () {
        after(function* () {
            yield Setting.deleteByUserName(user.userName);
        });

        it("should get different items after settings being changed", function* () {
            let itemPath = Path.join("Video", "ACG");
            let result1 = yield agent.get(constant.urls.index).query({ dir: itemPath }).expect(200).end();
            yield agent.post(constant.urls.settings).send({ media: { ".mp4": constant.players.none } }).expect(200).end();
            let result2 = yield agent.get(constant.urls.index).query({ dir: itemPath }).expect(200).end();
            assert.notEqual(result2.body, result1.body);
        });
    });
});