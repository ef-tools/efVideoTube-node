'use strict'
let app = require("./web-app");
let config = require("./config");

let server = app.listen(config.port);