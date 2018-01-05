/*
    Name: ClientAuth.js
    Description: This module contains http handlers for client authentication.
*/


var passport = require('passport');

module.exports = {

    authorize: function (req, res, next) {

        var ip = req.headers['x-forwarded-for'] ||
                     req.connection.remoteAddress ||
                     req.socket.remoteAddress ||
                     req.connection.socket.remoteAddress;
        sails.log.info('API login attempt from: ' + ip);

        try {

            passport.authenticate('api',
                 function (err, session, info) {
                     
                     // parse response
                     if (err) {
                         res.serverError(err);
                     } else {
                         if (session) {

                             // return session object
                             res.json({
                                 access_token: session.clientToken,
                                 success: true
                             });

                         } else {
                             res.forbidden({
                                 success: false,
                                 message: 'Access Denied'
                             });
                         }// if-else
                     }

                 })(req, res, next);
        } catch (e) {
            sails.log.error('AuthService.client.handler.authorize() Exception - ' + e.message);
            res.serverError(e.message);
        }// try-catch
    }
};