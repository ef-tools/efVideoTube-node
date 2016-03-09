'use strict'
let request = require("co-supertest");

module.exports = function (server) {
    let agent = request.agent(server);
    let headers = {};

    return {
        headers: headers,
        get: function (url) {
            return agent.get(url).set(headers);
        },
        post: function (url) {
            return agent.post(url).set(headers);
        }
    }
};