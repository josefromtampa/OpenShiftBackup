
/* 
    Name: auth.js
    Description: This module manages local authentication strategies for users and api clients.
*/

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    BearerStrategy = require('passport-http-bearer').Strategy,
    BasicStrategy = require('passport-http').BasicStrategy;


passport.serializeUser(function (session, done) {

    // use token for unique identifier
    done(null, session.clientToken);
});

passport.deserializeUser(function (token, done) {

    // find session by token
    TokenSession.findOne({ clientToken: token, active: true })
        .exec(function (e, doc) {
            done(e, doc);
        });

});

// local user authentication handler
passport.use('user', new LocalStrategy(
  function (username, password, done) {

      try {

          sails.log.debug('AuthStrategies.js - Authenticating user strategy for ' + username);

          // authenticate user at salesforce
          SalesForce.authenticateUser(username, password)
            .then(function (results) {

                if (results.success) {

                    sails.log.debug('AuthStrategies.js - SalesForce authenticated for ' + username);

                    // initailize a new session
                    TokenSession.grant('user', results.user).then(function (session) {

                        sails.log.debug('AuthStrategies.js - Access granted for user stratgy for ' + username);
                        // return session
                        return done(null, session);

                    }, function (e) {
                        sails.log.debug('AuthStrategies.js - Access NOT granted for user stratgy for ' + username);
                        return done(null, false);
                    });
                } else {
                    sails.log.debug('AuthStrategies.js - SalesForce authentication failed for ' + username + ' ' + password);
                    return done(null, false);
                }// if-else    


            }, function (e) {
                return done(e);
            });


      } catch (e) {
          sails.log.error('auth.js LocalStrategy authenticate exception for "user" - ' + e.message);
          return done(e.message);
      }// try-catch
  }
));

// local api clients authentication handler
passport.use('api', new LocalStrategy(
  function (clientId, secret, done) {

      try {

          sails.log.info('AuthStrategies.js - Authenticating API client strategy for ' + clientId);
          
          // validate client credentials
          APIClient.validateClient(clientId, secret)
            .then(function (result) {


                if (result) {
                    
                    sails.log.info('AuthStrategies.js - API client validated - granting access for ' + clientId);

                    // itialize a new session
                    TokenSession.grant('api', result).then(function (session) {

                        sails.log.info('AuthStrategies.js - Access granted for api client strategy for ' + clientId);

                        // return session
                        return done(null, session);

                    }, function (e) {
                        return done(null, false);
                    });
                } else {
                    sails.log.info('AuthStrategies.js - API client not valid for ' + clientId);
                    return done(null, false);
                }// if-else

            }, function (e) {
                sails.log.error('AuthStrategies - Unable to validate client ' + clientId + ' - ' + e);
                return done(e);
            });

      } catch (e) {
          sails.log.error('AuthStrategies LocalStrategy authenticate exeption for "api" - ' + e.message);
          return done(e.message);
      }// try-catch



  }
));

passport.use('bearer', new BearerStrategy(
  function (accessToken, done) {

      try {
          // validate token
          TokenSession.validateSession(accessToken).then(function (results) {

              if (results && results.success) {
                  return done(null, results.session.owner);
              } else {
                  return done(null, false);
              }// if-else

          }, function (e) {
              sails.log.error('AuthStrategies BearerStrategy - Unable to validate bearer token - ' + e);
              return done(e);
          });
      } catch (e) {
          sails.log.error('AuthStrategies BearerStrategy exception - ' + e.message);
          return done(e.message);
      }// try-catch

  }));


passport.use('private', new LocalStrategy(

  function (username, password, done) {

      sails.log.info('AuthStrategies.js - Authenticating PRIVATE pages strategy');

      if (username == 'ibhs_admin' && password == '1c37dfg5vOJc') {
          sails.log.info('Private Policy Auth - Authentication succeeded');
          return done(null, true);
      } else {
          sails.log.warn('Private Policy Auth - Authentication failed');
          return done(null, false);
      }// if-else

  }
));


