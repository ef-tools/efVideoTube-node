var app = require("koa")();
var auth = require("./utils/auth");
var router = require("./utils/router");
var publicRouter = require("./utils/public-router");

app.use(auth());

app.use(router.routes())
    .use(router.allowedMethods());

app.use(publicRouter.routes())
    .use(publicRouter.allowedMethods());

// catch all middleware, only land here
// if no other routing rules match
app.use(function* () {
    this.status = 401;
    // or redirect etc
    // this.redirect('/someotherspot');
});

module.exports = app;