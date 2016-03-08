var router = require("koa-router")();
var parse = require("co-body");
var _ = require("lodash");
var checkAuth = require("./check-auth");
var Setting = require("../models/setting");

router.use(checkAuth());

router.get("/index", function* () {
    this.body = "index";
});

router.get("/settings", function* () {
    var setting = yield Setting.findByUserName(this.user.user.userName);
    this.body = yield Setting.getPlayerSettingByDbSetting(setting);
});

router.post("/settings", function* () {
    var body = yield parse(this);
    var setting = yield Setting.findByUserName(this.user.user.userName);
    if (setting == null) {
        setting = new Setting({ userName: this.user.user.userName });
    }
    setting.media = body.media;
    yield setting.save();
    if (setting.id == undefined) {
       this.throw(500, "save failed."); 
    };
    this.body = setting.id;
});

module.exports = router;