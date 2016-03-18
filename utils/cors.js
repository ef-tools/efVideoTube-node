'use strict'

module.exports = function* (next) {
    yield* next;
    this.set("Access-Control-Allow-Origin", "*");
};