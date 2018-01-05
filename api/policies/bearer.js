/**
 * Allow any authenticated user.
 */
var passport = require('passport');

module.exports = function (req, res, done) {
    passport.authenticate('bearer', { session: false }, function (err, user, info) {

        // TODO: handle bearer results

        if (err) return done(err);
        if (user) return done();

        return res.send(403, { message: "You are not permitted to perform this action." });


    })(req, res);
};