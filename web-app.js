'use strict'
let app = require("koa")();
let appStatic = require("koa")();
let mount = require("koa-mount");
let serve = require("koa-static");
let router = require("koa-router")();
let routerPublic = require("koa-router")();
let auth = require("./utils/auth");
let cors = require("./utils/cors");
let checkAuth = require("./utils/check-auth");
let routeIndex = require("./routes/index");
let routeSettings = require("./routes/settings");
let routePlay = require("./routes/play");
let routeHome = require("./routes/public/home");
let routeSignIn = require("./routes/public/sign-in");
let config = require("./config");
let constant = require("./constant");

router.use(checkAuth);
router.get(constant.urls.index, routeIndex.get);
router.get(constant.urls.settings, routeSettings.get);
router.post(constant.urls.settings, routeSettings.post);
router.get(constant.urls.play, routePlay.get);
router.get(constant.urls.audio, routePlay.audio);
router.get(constant.urls.subtitle, routePlay.subtitle);

routerPublic.get("/", routeHome.get);
routerPublic.post(constant.urls.signin, routeSignIn.post);

appStatic.use(checkAuth);
appStatic.use(serve(config.mediaDirectoryName));
appStatic.use(serve(config.cacheDirectoryName));

app.use(auth);
app.use(cors);
app.use(router.routes()).use(router.allowedMethods());
app.use(routerPublic.routes()).use(routerPublic.allowedMethods());
app.use(mount("/" + config.mediaDirectoryName, appStatic));
app.use(mount("/" + config.cacheDirectoryName, appStatic));

// catch all middleware, only land here
// if no other routing rules match
app.use(function* () {
    this.status = 404;
    // or redirect etc
    // this.redirect('/someotherspot');
});

module.exports = app;