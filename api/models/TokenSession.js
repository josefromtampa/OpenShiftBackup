/**
* TokenSession.js
*
* @description :: This model represents a token session record.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var q = require('q');
/* var uuid = require('node-uuid'); */
var uuid = require('uuid');

module.exports = {

    attributes: {
        owner: {
            type: 'json'
        },
        types: {
            type: 'string'
        },
        clientToken: {
            type: 'string'
        },
        serverToken: {
            type: 'string'
        },
        expiry: {
            type: 'datetime'
        },
        actives: {
            type: 'boolean'
        }


    },

    validateSession: function (token) {

        var promise = q.Promise(function (resolve, reject, inform) {

            try {

                sails.log.info('TokenSession.validateSession() Validating session ' + token);

                // check session
                TokenSession.findOne({ clientToken: token, active: true }).exec(function (e, doc) {

                    // check for error
                    if (e) {
                        sails.log.error('TokenSession.validateSession() Exception retrieving session ' + token);
                        reject(e);
                    } else if (doc == undefined || doc == null) {
                        sails.log.warn('TokenSession.validateSession() Session is not valid');
                        resolve({ valid: false, session: null, message: 'Session is invalid' });
                    } else {

                        // check if session is expired
                        var now = new Date();
                        var expired = doc.expiry < now;

                        if (expired) {
                            sails.log.warn('TokenSession.validateSession() Session ' + token + ' is expired');
                            TokenSession.update({ clientToken: token }, { active: false });

                            resolve({ success: false, session: null, message: 'Session is expired' });
                        } else {
                            sails.log.info('TokenSession.validateSession() Session ' + token + ' is valid');
                            resolve({ success: true, session: doc, message: 'Valid session' });
                        }// if-else

                    }// if-else

                });
            } catch (e) {
                sails.log.error('TokenSession.validate() Exception - ' + e.message);
                reject(e.message);
            }// try-catch

        });

        return promise;
    },

    expire: function (token, remove) {

        var promise = q.Promise(function (resolve, reject, inform) {

            try {
                
                
                if (remove) {

                    sails.log.info('TokenSession.expire() Destroying session ' + token);

                    // destroy session
                    TokenSession.destroy({ clientToken: token }).exec(function (e) {

                        if (e) {
                            sails.log.error('TokenSession.expireSession() Exception destroying session - ' + e);
                            reject(e);
                        } else {
                            resolve({ success: true, message: 'Session destroyed', session: null });
                        }// if-else

                    });

                } else {

                    sails.log.info('TokenSession.expire() Expiring session ' + token);

                    // set active flag to false
                    TokenSession.update({ clientToken: token }, { active: false }).exec(function (e, results) {

                        if (e) {
                            sails.log.error('TokenSession.expireSession() Exception expiring session - ' + e);
                            reject(e);
                        } else {
                            resolve({ success: true, message: 'Session expired', session: (results && results.length > 0 ? results[0] : null) });
                        }// if-else

                    });
                }// if-else
            } catch (e) {
                sails.log.error('TokenSession.expireSession() Exception - ' + e.message);
                reject(e.message);
            }// try-catch

        });

        return promise;
    },

    grant: function (type, owner) {


        var promise = q.Promise(function (resolve, reject, inform) {

            try {

                sails.log.debug('TokenSession.grant() Granting access to ' + JSON.stringify(owner));

                // generate new token
                var token =  uuid.v4();
                var expiry = new Date();
                expiry.setDate(expiry.getDate() + 1);
                
                var session = {
                    owner: owner,
                    clientToken: token,
                    serverToken: (owner.serverToken ? owner.serverToken : ''),
                    type: type,
                    expiry: expiry,
                    active: true
                };
                                
                // create
                TokenSession.create(session).exec(function (e, results) {

                    if (e) {
                        reject(e);
                    } else {
                        resolve(session);
                    }// if-else
                });


            } catch (e) {
                sails.log.error('TokenSession.initialize() Exception - ' + e.message);
                reject(e.message);
            }// try-catch

        });

        return promise;
    },

    clean: function () {

        var promise = q.Promise(function (resolve, reject, inform) {

            try {

                sails.log.info('TokenSession.clean() Clearing all expired sessions');

                var now = new Date();

                // destroy session
                TokenSession.destroy({
                    $or: [{
                            active: false
                        },
                        {
                            expiry: { $lt: now }
                        }]
                }).exec(function (e) {

                    if (e) {
                        sails.log.error('TokenSession.expireSession() Exception cleaning session - ' + e);
                        reject(e);
                    } else {
                        resolve({ success: true, message: 'Sessions cleaned', session: null });
                    }// if-else

                });

              
            } catch (e) {
                sails.log.error('TokenSession.clean() Exception - ' + e.message);
                reject(e.message);
            }// try-catch

        });

        return promise;
    }

};

