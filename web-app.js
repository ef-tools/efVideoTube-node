var app = require("koa")();
var router = require("koa-router")();

router.get("/", function* () {
    this.body = "home";
});

app.use(router.routes())
    .use(router.allowedMethods());

module.exports = app;