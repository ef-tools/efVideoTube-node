var _ = require("lodash");

module.exports = function () {
    var store = {};
    var sidCookieName = "sid";

    function* loadSession(ctx) {
        var sid = ctx.cookies.get(sidCookieName);
        if (sid && _.has(store, sid)) {
            ctx.session = store[sid];
        }
        if (!ctx.session)
            ctx.session = {};
        return sid;
    }

    function* saveSession(ctx, sid) {
        if (!ctx.session) {
            ctx.cookies.set(sidCookieName, null, { maxAge: -1 });
            delete store[sid]
        }
        else if (!sid) {
            sid = "anything uid";
            ctx.cookies.set(sidCookieName, sid);
            store[sid] = ctx.session;
        }
    }

    return function* (next) {
        var sid = yield loadSession(this);

        yield next;

        yield saveSession(this, sid);
    }
}