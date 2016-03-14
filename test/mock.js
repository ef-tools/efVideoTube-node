'use strict'
let Path = require("path");

let media = {
    Video: {
        ACG: {
            "↑↑↓↓←→←→BA.mp4": "",
            "「アニメ最萌トーナメント2007」本選開幕記念MAD：「はならんまん」.avi": "",
            "Blue_Sky_Azure_girl.webm": "",
            "secret base ～君がくれたもの～.mp4": "",
            "デジャブ·ザ·ファイヤー.flv": ""
        },
        Anime: {
            "[Movie]": {
                "Hanasaku_Iroha_The_Movie.ass": "",
                "Hanasaku_Iroha_The_Movie.mp4": "",
                "K-ON!_Movie.chs.ass": "",
                "K-ON!_Movie.jpn.idx": "",
                "K-ON!_Movie.jpn.sub": "",
                "K-ON!_Movie.mp4": ""
            },
            "[P.A.WORKS]": {
                "Hanasaku_Iroha": {
                    "Hanasaku_Iroha_01.chs.ass": "",
                    "Hanasaku_Iroha_01.jpn.ass": "",
                    "Hanasaku_Iroha_01.mp4": "",
                    "Hanasaku_Iroha_02.chs.ass": "",
                    "Hanasaku_Iroha_02.jpn.ass": "",
                    "Hanasaku_Iroha_02.mp4": "",
                    "Hanasaku_Iroha_03.chs.ass": "",
                    "Hanasaku_Iroha_03.jpn.ass": "",
                    "Hanasaku_Iroha_03.mp4": "",
                    "Hanasaku_Iroha_04.chs.ass": "",
                    "Hanasaku_Iroha_04.jpn.ass": "",
                    "Hanasaku_Iroha_04.mp4": "",
                    "Hanasaku_Iroha_05.chs.ass": "",
                    "Hanasaku_Iroha_05.jpn.ass": "",
                    "Hanasaku_Iroha_05.mp4": "",
                    "Hanasaku_Iroha_06.chs.ass": "",
                    "Hanasaku_Iroha_06.jpn.ass": "",
                    "Hanasaku_Iroha_06.mp4": "",
                    "Hanasaku_Iroha_07.chs.ass": "",
                    "Hanasaku_Iroha_07.jpn.ass": "",
                    "Hanasaku_Iroha_07.mp4": "",
                },
                "TARI_TARI": {
                    "TARI_TARI_01.jp.ass": "",
                    "TARI_TARI_01.mp4": "",
                    "TARI_TARI_01.sc.ass": "",
                    "TARI_TARI_02.jp.ass": "",
                    "TARI_TARI_02.mp4": "",
                    "TARI_TARI_02.sc.ass": "",
                    "TARI_TARI_03.jp.ass": "",
                    "TARI_TARI_03.mp4": "",
                    "TARI_TARI_03.sc.ass": "",
                    "TARI_TARI_04.jp.ass": "",
                    "TARI_TARI_04.mp4": "",
                    "TARI_TARI_04.sc.ass": "",
                    "TARI_TARI_05.jp.ass": "",
                    "TARI_TARI_05.mp4": "",
                    "TARI_TARI_05.sc.ass": ""
                },
                "True_Tears": {
                    "True_Tears_01.chs.ass": "",
                    "True_Tears_01.mp4": "",
                    "True_Tears_02.chs.ass": "",
                    "True_Tears_02.mp4": "",
                    "True_Tears_03.chs.ass": "",
                    "True_Tears_03.mp4": "",
                    "True_Tears_04.chs.ass": "",
                    "True_Tears_04.mp4": ""
                }
            },
            "Yoroiden_Samurai_Troopers": {
                "Yoroiden_01.mp4": "",
                "Yoroiden_02.mp4": "",
                "Yoroiden_03.mp4": "",
                "Yoroiden_04.mp4": "",
                "Yoroiden_05.mp4": "",
                "Yoroiden_06.mp4": "",
                "Yoroiden_07.mp4": "",
                "Yoroiden_08.mp4": "",
                "Yoroiden_09.mp4": "",
                "Yoroiden_10.mp4": ""
            },
            "Hayate_the_Combat_Butler": {
                "Hayate_01.mp4": "",
                "Hayate_02.mp4": "",
                "Hayate_03.mp4": "",
                "Hayate_04.mp4": "",
                "Hayate_05.mp4": "",
                "Hayate_06.mp4": ""
            },
            "Place_to_Place": {
                "Place_to_Place_01.jp.srt": "",
                "Place_to_Place_01.mp4": "",
                "Place_to_Place_01.tc.ass": "",
                "Place_to_Place_02.jp.srt": "",
                "Place_to_Place_02.mp4": "",
                "Place_to_Place_02.tc.ass": "",
                "Place_to_Place_03.jp.srt": "",
                "Place_to_Place_03.mp4": "",
                "Place_to_Place_03.tc.ass": "",
                "Place_to_Place_04.jp.srt": "",
                "Place_to_Place_04.mp4": "",
                "Place_to_Place_04.tc.ass": "",
                "Place_to_Place_05.jp.srt": "",
                "Place_to_Place_05.mp4": "",
                "Place_to_Place_05.tc.ass": "",
                "Place_to_Place_06.jp.srt": "",
                "Place_to_Place_06.mp4": "",
                "Place_to_Place_06.tc.ass": "",
                "Place_to_Place_07.jp.srt": "",
                "Place_to_Place_07.mp4": "",
                "Place_to_Place_07.tc.ass": "",
                "Place_to_Place_08.jp.srt": "",
                "Place_to_Place_08.mp4": "",
                "Place_to_Place_08.tc.ass": ""
            }
        },
        Coding: {
            "golang": {
                "Build_Web_Apps_with_Go_Language_golang_hd720.mp4": "",
                "Google I_O 2012 - Go Concurrency Patterns.en.srt": "",
                "Google I_O 2012 - Go Concurrency Patterns.webm": "",
                "Google_I_O_2013_-_High_Performance_Apps_with_Go_on_App_Engine.en.srt": "",
                "Google_I_O_2013_-_High_Performance_Apps_with_Go_on_App_Engine.mp4": "",
                "Waza - Concurrency is not Parallelism.mp4": ""
            },
            "ruby": {
                "Rails for Zombies Lv.1.mp4": "",
                "Rails for Zombies Lv.2.mp4": "",
                "Rails for Zombies Lv.3.mp4": "",
                "Rails for Zombies Lv.4.mp4": "",
                "Rails for Zombies Lv.5.mp4": ""
            },
            "Google_I_O_2010_The_world_of_ListView.webm": "",
            "Google_I_O_2010_The_world_of_ListView.srt": ""
        },
        Economics: {
            "Ben Bernanke throws the dollar over the Currency Cliff.webm": "",
            "Dollar Paul Krugman.txt": "",
            "Dollar Paul Krugman.webm": "",
            "Peter Schiff's Stand-Up Comedy at NY's Funniest Reporter Show.mp4": "",
            "QE3 Mashup~ Bernanke Peter Schiff Ron Paul.webm": "",
            "Why the Meltdown Should Have Surprised No One _ Peter Schiff.docx": "",
            "Why the Meltdown Should Have Surprised No One _ Peter Schiff.en.srt": "",
            "Why the Meltdown Should Have Surprised No One _ Peter Schiff.sc.ass": "",
            "Why the Meltdown Should Have Surprised No One _ Peter Schiff.webm": "",
            "彼得·希夫 —— 瑞典该听克鲁格曼的馊主意吗？.mp4": ""
        }
    },
    Music: {
        ACG: {
            "100もの扉.m4a": "",
            "18.m4a": "",
            "18番目のサマーホリデー.m4a": "",
            "365日の紙飛行機.m4a": "",
            "5センチ。.m4a": "",
            "After Rain.m4a": "",
            "Age♂Age♂EVERY☆騎士.m4a": ""
        }
    },
    AudioBook: {
        "For a New Liberty": {
            "1 The Libertarian Heritage The American Revolution and Classical Liberalism Murray N Rothbard.mp3": "",
            "10 The Public Sector, I Government in Business Murray N Rothbard.mp3": "",
            "11 The Public Sector, II Streets and Roads Murray N Rothbard.mp3": "",
            "12 The Public Sector, III Police, Law, and the Courts Murray N Rothbard.mp3": "",
            "13 Conservation, Ecology, and Growth Murray N Rothbard.mp3": "",
            "14 War and Foreign Policy Murray N Rothbard.mp3": "",
            "15 A Strategy for Liberty Murray N Rothbard.mp3": "",
            "2 The Libertarian Creed Property and Exchange Murray N Rothbard.mp3": "",
            "3 The State Murray N Rothbard.mp3": "",
            "4 Libertarian Applications to Current Problems The Problems Murray N Rothbard.mp3": "",
            "5 Involuntary Servitude Murray N Rothbard.mp3": "",
            "6 Personal Liberty Murray N Rothbard.mp3": "",
            "7 Education Murray N Rothbard.mp3": "",
            "8 Welfare and the Welfare State Murray N Rothbard.mp3": "",
            "9 Inflation and the Business Cycle The Collapse of the Keynesian Paradigm Murray N Rothbard.mp3": "",
            "Folder.jpg": "",
            "Introduction Llewellyn H Rockwell Jr.mp3": ""
        }
    }
};

let mediaData = new Map();

let nodes = [media];
mediaData.set(media, {
    name: "",
    path: "",
    parent: ""
});
for (let i = 0; i < nodes.length; i++) {
    let item = nodes[i];
    let subItemNames = Object.keys(item);
    let dirNames = subItemNames.filter(i => typeof item[i] === "object");
    dirNames.forEach(d => {
        mediaData.set(item[d], {
            name: d,
            path: Path.join(mediaData.get(item).path, d),
            parent: mediaData.get(item).path
        })
        nodes.push(item[d]);
    });
}

module.exports = {
    fs: {
        Media: media
    },
    mediaData: mediaData
};