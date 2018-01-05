/**
 * Allow any authenticated user.
 */

var passport = require('passport');

module.exports = function (req, res, next) {
   
    try {

        sails.log.debug('Authenticating private request');

        // authenticate for private pages permissions
        passport.authenticate('private',
             function (err, valid, info) {

                 // parse response
                 if (err) {
                     sails.log.error('Private request authentication failed');
                     return res.serverError(err);
                 } else {

                     sails.log.debug('Private request authentication succeeded');
                     if (valid) {
                         return next();
                        
                     } else {

                         return res.forbidden({
                             success: false,
                             message: 'Access Denied'
                         });
                     }// if-else
                 }

             })(req, res, next);
        

    } catch (e) {
        return res.serverError({ error: e.message });
    }// try-catch

};