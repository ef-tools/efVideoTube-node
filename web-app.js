'use strict'
let app = require("koa")();
let router = require("koa-router")();
let routerPublic = require("koa-router")();
let auth = require("./utils/auth");
let checkAuth = require("./utils/check-auth");
let routeIndex = require("./routes/index");
let routeSettings = require("./routes/settings");
let routePlay = require("./routes/play");
let routePlaylist = require("./routes/playlist");
let routeHome = require("./routes/public/home");
let routeSignIn = require("./routes/public/sign-in");
let constant = require("./constant");

router.use(checkAuth);
router.get(constant.urls.index, routeIndex.get);
router.get(constant.urls.settings, routeSettings.get);
router.post(constant.urls.settings, routeSettings.post);
router.get(constant.urls.play, routePlay.get);
router.get(constant.urls.playlist, routePlaylist.get);

routerPublic.get("/", routeHome.get);
routerPublic.get(constant.urls.signin, routeSignIn.get);
routerPublic.post(constant.urls.signin, routeSignIn.post);

app.use(auth);
app.use(router.routes());
app.use(routerPublic.routes());

// catch all middleware, only land here
// if no other routing rules match
app.use(function* () {
    this.status = 404;
    // or redirect etc
    // this.redirect('/someotherspot');
});

module.exports = app;