var request = require("co-supertest");

module.exports = function (server) {
    var agent = request.agent(server);
    var headers = {};

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