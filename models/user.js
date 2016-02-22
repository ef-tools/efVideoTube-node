var _ = require("lodash");

var User = function (properties) {
    _.assign(this, properties);
};

module.exports = User;