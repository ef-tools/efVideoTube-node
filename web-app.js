var app = require("koa")();
var router = require("koa-router")();

router.get("/", function* () {
    this.body = "home";
});

router.get("/signin", function* () {
    this.body = "sign in page";
});

router.post("/signin", function* () {
    this.body = { token: "fake" };
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