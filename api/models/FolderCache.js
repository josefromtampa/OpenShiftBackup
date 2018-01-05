/**
* FolderCache.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {
        type: {
            type: 'string',
            required: true
        },
        owner: {
            type: 'string'
        },
        category: {
            type: 'string',
        },
        name: {
            type: 'string'
        },
        value: {
            type: 'json',
            required: true
        },
        version: {
            type: 'string',
            required: true
        }

    },

    upsert: function (type, owner, category, name, value, version, done) {

        try {

            FolderCache.native(function (e, col) {

                // check if errored
                if (e) {
                    // return error
                    sails.log.error('FolderCache.upsert() Exception - ' + e);
                    done(e);
                } else {
                    
                    col.update({ type: type, category: category, owner: owner }, 
                        {
                            $set: {
                                type: type,
                                owner: owner,
                                category: category,
                                name: name,
                                value: value,
                                updatedAt: new Date(),
                                version: version
                            }
                        },
                        { upsert: true, safe: true, multi: true },
                        function (err) {
                            if (err) {
                                sails.log.error('FolderCache.upsert() Update Exception - ' + err);
                                done(e);
                            } else {
                                done(null);
                            }
                        }
                  );

                }// if-else
            });

        } catch (e) {
            sails.log.error('FolderCache.upsert() Exception - ' + e.message);
            done(e.message);
        }// try-catch

    },

    folderTypes: {
            public: 'public',
            member: 'private/members',
            company: 'private/companies',
            committee: 'private/committees'
        
    }
};

