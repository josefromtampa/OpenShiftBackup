/**
* Cache.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {

        key: {
            type: 'string',
            required: true

        },

        value: {
            type: 'json',
            required: true

        }

    },

    upsert: function (key, value, done) {

        Cache.native(function (e, col) {

            // check if errored
            if (e) {
                // return error
                sails.log.error('Cache.upsert() Exception - ' + e);
                done(e);
            } else {
                
                col.update({ key: key }, 
                    {
                        $set: {
                            key: key,
                            value: value,
                            updatedAt: new Date()
                        }
                    },
                    { upsert: true, safe: true, multi: true },
                    function (err) {
                        if (err) {
                            sails.log.error('Cache.upsert() Update Exception - ' + err);
                            done(e);
                        } else {
                            done(null);
                        }
                    }
              );

            }// if-else
        });

    }




};

