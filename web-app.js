'use strict'
let app = require("koa")();
let router = require("koa-router")();
let routerPublic = require("koa-router")();
let auth = require("./utils/auth");
let checkAuth = require("./utils/check-auth");
let routeIndex = require("./routes/index");
let routeSettings = require("./routes/settings");
let routeVideo = require("./routes/video");
let routeHome = require("./routes/public/home");
let routeSignIn = require("./routes/public/sign-in");

router.use(checkAuth);
router.get("/index", routeIndex.get);
router.get("/settings", routeSettings.get);
router.post("/settings", routeSettings.post);
router.get("/video", routeVideo.get);

routerPublic.get("/", routeHome.get);
routerPublic.get("/signin", routeSignIn.get);
routerPublic.post("/signin", routeSignIn.post);

app.use(auth);
app.use(router.routes());
app.use(routerPublic.routes());

// catch all middleware, only land here
// if no other routing rules match
app.use(function* () {
    this.status = 401;
    // or redirect etc
    // this.redirect('/someotherspot');
});

module.exports = app;