/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {


    sails.log.info('Validating token ' + req.query.access_token);

    // validate session
    TokenSession.validateSession(req.query.access_token).then(function (results) {

        if (results.valid) {
            // set session to req object and call next
            req.params.session = results.session;
            return next();
        } else {
            sails.log.warn('Access token ' + req.params.access_token + ' invalid');
            return res.forbidden({ error: results.message });
        }// if-else

    }).fail(function (e) {

        sails.log.error('Token validation exception - ' + e);
        return res.serverError({ error: e });
    });

};
