/**
* APIClient.js
*
* @description :: This model represents a client record for API access.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var q = require('q');

module.exports = {

    attributes: {

        clientId: {
            type: 'string',
            required: true
        },
        secret: {
            type: 'string',
            required: true
        },
        type: {
            type: 'string'
        },
        token: {
            type: 'string'
        },
        active: {
            type: 'boolean'
        }


    },

    validateClient: function (clientId, secret) {

        var promise = q.Promise(function (resolve, reject, inform) {

            try {

                // validate client credentials
                APIClient.findOne({ clientId: clientId, secret: secret })
                  .exec(function (e, doc) {

                      if (e) {
                          reject(e);
                      } else {

                          resolve(doc);

                      }// if-else
                  });

            } catch (e) {
                sails.log.error('APIClient.validate() Exception - ' + e.message);
                reject(e.message);
            }// try-catch

        });

        return promise;
    }

};

