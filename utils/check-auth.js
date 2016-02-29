module.exports = function () {
    return function* (next) {
        if (this.user)
            yield next;
        else
            this.throw(401, "Unauthorized");
    };
};