'use strict'
let _ = require("lodash");

let corsHeaders = {
    "Access-Control-Allow-Origin": "*"
};

module.exports = function* (next) {
    try {
        yield* next;
        this.set(corsHeaders);
    } catch (err) {
        err.headers = _.assign(err.headers, corsHeaders);
        throw err;
    }
};