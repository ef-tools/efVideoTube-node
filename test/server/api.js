'use strict'
require("co-mocha");
let assert = require("assert");
let util = require("util");
let webApp = require("../../web-app");
let User = require("../../models/user");
let agentFactory = require("../../utils/agent-factory");
let config = require("../../config");
let constant = require("../../constant");

describe("Test private APIs", function () {
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
    });
    after(function* () {
        yield User.delete(user.userName);
    });

    describe("Test /settings api", function () {
        it("should get 401 without token", function* () {
            yield agentFactory(server).get(constant.urls.settings).expect(401).end();
        });

        it("should get default settings with token", function* () {
            let result = yield agent.get(constant.urls.settings).expect(200).end();
            let media = result.body.media;
            assert(media);
            assert.deepEqual(Object.keys(media), Array.from(config.media));
            for (let ext of Object.keys(media)) {
                assert.equal(media[ext].active, config.media.get(ext)[0]);
                assert.deepEqual(media[ext].players, config.media.get(ext));
            }
        });

        it("should save settings", function* () {
            let settings = {
                media: {
                    ".mp4": constant.players.h5video,
                    ".m4a": constant.players.none,
                    ".wmv": constant.players.flash,  // mismatched player
                    ".flv": "whatever",              // invalid player
                    ".mpc": constant.players.h5audio // invalid extension
                }
            };
            let validSettings = { media: _.pick(settings.media, [".mp4", ".m4a"]) };
            yield agent.post(constant.urls.settings).send(settings).expect(200).end();
            let result = yield agent.get(constant.urls.settings).expect(200).end();
            let media = result.body.media;
            assert(media);
            assert.deepEqual(Object.keys(media), Array.from(config.media));
            for (let ext of Object.keys(media)) {
                assert.equal(media[ext].active, ext in validSettings.media ? validSettings.media[ext] : config.media.get(ext)[0]);
                assert.deepEqual(media[ext].players, config.media.get(ext));
            }
        });
    });
});