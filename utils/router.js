var router = require("koa-router")();
var parse = require("co-body");
var _ = require("lodash");
var checkAuth = require("./check-auth");

router.use(checkAuth());

router.get("/index", function* () {
    this.body = "index";
});

router.get("/settings", function* () {
    this.body = "settings";
});

module.exports = router;