var app = require("koa")();
var router = require("koa-router")();

router.get("/", function* () {
    this.body = "home";
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