var koa = require("koa");
var session = require("./session");

var app = koa();

app.keys = ["key"];

app.use(session());

app.use(function* () {
    switch (this.request.url) {
        case "/setname":
            this.session.userName = "ef";
            this.body = this.session.userName;
            break;
        case "/getname":
            this.body = this.session.userName;
            break;
        case "/clear":
            this.session = null;
            this.status = 204;
            break;
    }
});

var server = app.listen(3000);