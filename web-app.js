var app = require("koa")();
var router = require("koa-router")();
var parse = require("co-body");
var jwt = require("jsonwebtoken");
var _ = require("lodash");
var User = require("./models/user");

var secret = "efVideoTube";

router.get("/", function* () {
    this.body = "home";
});

router.get("/signin", function* () {
    this.body = "sign in page";
});

router.post("/signin", function* () {
    var body = yield parse(this);
    var user = yield User.findByUserName(body.userName);
    if (user && (yield user.validate(body.password))) {
        var claim = {
            user: _.pick(user, ["id", "userName"])
        };
        this.body = {
            token: jwt.sign(claim, secret)
        };
    }
    else
        this.throw(401, "Invalid user credentials.");
});

app.use(router.routes())
    .use(router.allowedMethods());

// catch all middleware, only land here
// if no other routing rules match
app.use(function* () {
    this.status = 401;
    // or redirect etc
    // this.redirect('/someotherspot');
});

module.exports = app;