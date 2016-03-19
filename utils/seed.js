'use strict'
let util = require("util");
let co = require("co");
let r = require("./rethinkdb");
let User = require("../models/user");

function* createUser(userName, password) {
    if (!userName || !password) {
        console.log("Invalid arguments.");
        return;
    }

    let user = yield* User.findByUserName(userName);
    if (!user) {
        user = new User({ userName: userName, password: password });
        yield* user.save();
        console.log("User created:\n%s", util.inspect(user));
    }
}

let args = process.argv.slice(2);
co(createUser(args[0], args[1])).then(function () {
    r.getPoolMaster().drain();
}, function (err) {
    console.error(err.stack);
    r.getPoolMaster().drain();
});
