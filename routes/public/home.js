'use strict'

module.exports = {
    get: function () {
        return function* () {
            this.body = "home";
        };
    }
};