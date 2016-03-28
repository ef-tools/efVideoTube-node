'use strict'
require("co-mocha");
let assert = require("assert");
let Path = require("path");
let _ = require("lodash");
let mockFs = require('mock-fs');
let webApp = require("../../web-app");
let User = require("../../models/user");
let agentFactory = require("../agent-factory");
let config = require("../../config");
let constant = require("../../constant");
let mock = require("../mock");

describe("Test /play api", function () {
    let server = webApp.listen();
    let user, agent;

    before(function* () {
        let userName = "erich_test";
        let password = "pwdpwd";
        user = new User({ userName: userName, password: password });
        yield* user.save();

        agent = agentFactory(server);
        let result = yield agent.post(constant.urls.signin).send({ userName: userName, password: password }).expect(200).end()
        agent.headers["Authorization"] = `Bearer ${result.body.token}`;

        mockFs(mock.fs);
    });
    after(function* () {
        yield* User.deleteByUserName(user.userName);
        mockFs.restore();
    });

    it("should get 401 without token", function* () {
        yield agentFactory(server).get(constant.urls.play).expect(401).end();
    });

    it("should get 400 on invalid file type", function* () {
        yield agent.get(constant.urls.play).query({ path: "「アニメ最萌トーナメント2007」本選開幕記念MAD：「はならんまん」.avi" }).expect(400).end();
    });

    it("should get 404 on invalid path", function* () {
        yield agent.get(constant.urls.play).query({ path: "not exist.mp4" }).expect(404).end();
    });

    it("should get play info for mp4", function* () {
        let path = Path.join("Video", "ACG", "secret base ～君がくれたもの～.mp4");
        let parentPath = Path.dirname(path);
        yield agent.get(constant.urls.play).query({ path: path }).expect(200, {
            player: constant.players.h5video,
            name: Path.basename(path, Path.extname(path)),
            video: "/Media/Video/ACG/secret base ～君がくれたもの～.mp4",
            audio: "/play/audio?path=" + encodeURIComponent(path),
            subtitles: [],
            parent: {
                name: Path.basename(parentPath),
                path: parentPath
            }
        }).end();
    });

    it("should get play info for webm", function* () {
        let path = Path.join("Video", "ACG", "Blue_Sky_Azure_girl.webm");
        let parentPath = Path.dirname(path);
        yield agent.get(constant.urls.play).query({ path: path }).expect(200, {
            player: constant.players.h5video,
            name: Path.basename(path, Path.extname(path)),
            video: "/Media/Video/ACG/Blue_Sky_Azure_girl.webm",
            audio: "/play/audio?path=" + encodeURIComponent(path),
            subtitles: [],
            parent: {
                name: Path.basename(parentPath),
                path: parentPath
            }
        }).end();
    });

    it("should get play info for wmv", function* () {
        let path = Path.join("Video", "Coding", "dotNet", "Jason Dolinger MVVM.wmv");
        let parentPath = Path.dirname(path);
        yield agent.get(constant.urls.play).query({ path: path }).expect(200, {
            player: constant.players.silverlight,
            name: Path.basename(path, Path.extname(path)),
            video: "/Media/Video/Coding/dotNet/Jason Dolinger MVVM.wmv",
            subtitles: [],
            parent: {
                name: Path.basename(parentPath),
                path: parentPath
            }
        }).end();
    });

    it("should get play info for flv", function* () {
        let path = Path.join("Video", "ACG", "デジャブ·ザ·ファイヤー.flv");
        let parentPath = Path.dirname(path);
        yield agent.get(constant.urls.play).query({ path: path }).expect(200, {
            player: constant.players.flash,
            name: Path.basename(path, Path.extname(path)),
            video: "/Media/Video/ACG/デジャブ·ザ·ファイヤー.flv",
            subtitles: [],
            parent: {
                name: Path.basename(parentPath),
                path: parentPath
            }
        }).end();
    });

    it("should get play info for m4a", function* () {
        let path = Path.join("Music", "ACG", "100もの扉.m4a");
        let parentPath = Path.dirname(path);
        yield agent.get(constant.urls.play).query({ path: path }).expect(200, {
            player: constant.players.h5audio,
            name: Path.basename(path, Path.extname(path)),
            audio: "/Media/Music/ACG/100もの扉.m4a",
            parent: {
                name: Path.basename(parentPath),
                path: parentPath
            }
        }).end();
    });

    it("should get play info for mp3", function* () {
        let path = Path.join("AudioBook", "For a New Liberty", "Introduction Llewellyn H Rockwell Jr.mp3");
        let parentPath = Path.dirname(path);
        yield agent.get(constant.urls.play).query({ path: path }).expect(200, {
            player: constant.players.h5audio,
            name: Path.basename(path, Path.extname(path)),
            audio: "/Media/AudioBook/For a New Liberty/Introduction Llewellyn H Rockwell Jr.mp3",
            parent: {
                name: Path.basename(parentPath),
                path: parentPath
            }
        }).end();
    });

    it("should get ass subtitles", function* () {
        let path = Path.join("Video", "Anime", "[P.A.WORKS]", "Hanasaku_Iroha", "Hanasaku_Iroha_01.mp4");
        let parentPath = Path.dirname(path);
        yield agent.get(constant.urls.play).query({ path: path }).expect(200, {
            player: constant.players.h5video,
            name: Path.basename(path, Path.extname(path)),
            video: "/Media/Video/Anime/[P.A.WORKS]/Hanasaku_Iroha/Hanasaku_Iroha_01.mp4",
            audio: "/play/audio?path=" + encodeURIComponent(path),
            subtitles: [{
                src: "/play/subtitle?path=" + encodeURIComponent(Path.join("Video", "Anime", "[P.A.WORKS]", "Hanasaku_Iroha", "Hanasaku_Iroha_01.chs.ass")),
                srclang: "zh-hans",
                label: "中文(简体)",
                default: true
            }, {
                    src: "/play/subtitle?path=" + encodeURIComponent(Path.join("Video", "Anime", "[P.A.WORKS]", "Hanasaku_Iroha", "Hanasaku_Iroha_01.jpn.ass")),
                    srclang: "ja",
                    label: "日本語"
                }],
            parent: {
                name: Path.basename(parentPath),
                path: parentPath
            }
        }).end();
    });

    it("should get srt subtitles", function* () {
        let path = Path.join("Video", "Economics", "Why the Meltdown Should Have Surprised No One _ Peter Schiff.webm");
        let parentPath = Path.dirname(path);
        yield agent.get(constant.urls.play).query({ path: path }).expect(200, {
            player: constant.players.h5video,
            name: Path.basename(path, Path.extname(path)),
            video: "/Media/Video/Economics/Why the Meltdown Should Have Surprised No One _ Peter Schiff.webm",
            audio: "/play/audio?path=" + encodeURIComponent(path),
            subtitles: [{
                src: "/play/subtitle?path=" + encodeURIComponent(Path.join("Video", "Economics", "Why the Meltdown Should Have Surprised No One _ Peter Schiff.sc.ass")),
                srclang: "zh-hans",
                label: "中文(简体)",
                default: true
            }, {
                    src: "/play/subtitle?path=" + encodeURIComponent(Path.join("Video", "Economics", "Why the Meltdown Should Have Surprised No One _ Peter Schiff.en.srt")),
                    srclang: "en",
                    label: "English"
                }],
            parent: {
                name: Path.basename(parentPath),
                path: parentPath
            }
        }).end();
    });
});