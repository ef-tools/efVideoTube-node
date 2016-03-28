'use strict'
let util = require("util");
let co = require("co");
let db = require("../db/db-adapter");
let User = require("../models/user");


let args = process.argv.slice(2);
co(function* (){
    yield* createUser(args[0], args[1]);
    yield* db.close();
}).catch(function (err) {
    console.error(err.stack);
});

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