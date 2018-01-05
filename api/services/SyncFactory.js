
/*
*   Title: SyncFactory.js
*   Description: This module manages the business rules and syncronization of the file store cache.
*/

var async = require('async');
var q = require('q');

var _job = null;
var _timeout = 200;

var _folderSync = {

    clean: function(processDate){

        var promise = q.Promise(function (resolve, reject, inform) {

            try {

                // delete all before process date
                FolderCache.destroy({ updatedAt: { $lt: processDate } }).exec(function (e) {

                    if (e) {
                        reject(e);
                    } else {
                        resolve();
                    }// if-else
                });

            } catch (e) {
                sails.log.error('SyncFactory._folderSync.clean() Exception - ' + e.message);
                reject(e.message);
            }// try-catch

        });
        
        return promise;
    },

    syncCategories: function(parent, type, owner, folders, categoryOverride){

        var promise = q.Promise(function(resolve, reject, inform){

            try {

                // recurse for subfolders
                async.eachSeries(folders, function (folder, catCallback) {

                    sails.log.info('SyncFactory._folderSync.syncCategories() retrieving category ' + folder.name + ' folder for ' + parent);

                    setTimeout(function () {
                        // get and cache each category result
                        FileStoreFactory.file.list(parent + '/' + folder.name).then(function (catResults) {

                            sails.log.info('SyncFactory._folderSync.syncCategories() caching category ' + folder.name + ' folder for ' + parent);

                            try {

                                if (catResults.success && catResults.data.files && catResults.data.files.length > 0) {

                                    FolderCache.upsert(type, owner.toLowerCase(), (categoryOverride ? categoryOverride.toLowerCase() : folder.name.toLowerCase()), folder.name, catResults.data.files, 'cache',
                                        function (e) {
                                            if (e) {
                                                sails.log.error('SyncFactory._folderSync.syncCategories() Cache save failed - ' + e);
                                            }// if
                                            catCallback();
                                        });
                                } else {
                                    if (!catResults.success) {
                                        sails.log.error('SyncFactory._folderSync.syncCategories() file list response ' + JSON.stringify(catResults));
                                    }// if

                                    // next
                                    catCallback();
                                }// if-else
                            } catch (e) {
                                sails.log.error('SyncFactory._folderSync.syncCategories() Exception - ' + e.message);
                                catCallback();
                            }// try-catch
                        }).fail(function(e){
                            reject(e);
                        });
                    }, _timeout);

                }, function (e) {
                    // all done
                    if (e) {
                        // error occurred
                        sails.log.error('SyncFactory._folderSync.syncCategories() Exception() for folder ' + parent + ' - ' + e);
                        reject(e);
                    } else {

                        sails.log.info('SyncFactory._folderSync.syncCategories() categories cached for folder ' + parent);
                        resolve({success: true, message: 'Categories cached'});

                    }// if-else
                });

            } catch (e) {
                sails.log.error('SyncFactory._folderSync.syncCategories() Exception for folder ' + parent + ' - ' + e.message);
                reject(e.message);
            }// try-catch
        });

        return promise;
    },

    syncRoot: function (root, type, owner, name, cacheRoot, cacheCategories, categoryOverride) {

        sails.log.info('SyncFactory._folderSync.syncRoot() Retrieving ' + type + ' folder for sync');

        cacheRoot = cacheRoot != undefined ? cacheRoot : true;
        cacheCategories = cacheCategories != undefined ? cacheCategories : false;

            // get all files
        return FileStoreFactory.file.list(root).then(function (results) {

            sails.log.info('SyncFactory._folderSync.syncRoot() caching ' + type + ' folder');

            if (results.success) {

                try {

                    if (cacheRoot && results.data.files && results.data.files.length > 0) {
                        // cache root
                        FolderCache.upsert(type, (owner ? owner.toLowerCase() : ''), (categoryOverride ? categoryOverride.toLowerCase() : ''), name, results.data.files, 'cache',
                            function (e) {

                                if (e) {
                                    sails.log.error('SyncFactory._folderSync.syncRoot() ' + type + ' folder cache error - ' + e);

                                } else {

                                    sails.log.info('SyncFactory._folderSync.syncPublic() public folder cached');
                                }// if-else
                            });
                    }// if

                    sails.log.info('SyncFactory._folderSync.syncRoot() processing ' + type + ' folders ' + JSON.stringify(results.data.folders));

                    if (cacheCategories && results.data.folders && results.data.folders.length > 0) {

                        // sync categories
                        return _folderSync.syncCategories(root, type, (owner ? owner.toLowerCase() : results.data.name.toLowerCase()), results.data.folders, categoryOverride)
                            .then(function (results) {

                                sails.log.info('SyncFactory._folderSync.syncRoot() categories synced for ' + root);

                                if (results.success) {
                                    return ({ success: true, data: results.data, message: 'Root and categories cached' });
                                } else {
                                    return ({ success: true, data: results.data, message: 'Root cached, catagories did not cache' });
                                }// if-else
                            });


                    } else {
                        sails.log.info('SyncFactory._folderSync.syncRoot() No folders to cache for ' + root);
                        return ({ success: true, data: results.data, message: 'Root cached' });
                    }// if-else

                } catch (e) {

                    sails.log.error('SyncFactory._folderSync.syncRoot() Root parse exception - ' + e.message);

                    throw (e.message);
                }// try-catch

            } else {
                sails.log.warn('SyncFactory._folderSync.syncRoot() No root results for ' + root);
                //resolve({ success: false, message: 'No root results' });
                throw (results.message);
            }// if-else

        }).fail(function (e) {
            sails.log.error('SyncFactory._folderSync.syncRoot() Exception retrieving list for ' + root);
            throw (e);
        });

    },

    syncPublic: function (done) {

        sails.log.debug('SycFactory syncPublic() starting');

        try {
            var type = FolderCache.folderTypes.public;
            var root = sails.config.egnyte.root + type;

            // sync root and categories within
            _folderSync.syncRoot(root, type, '', '', false, true).then(function (results) {

                done();
            }).fail(function (e) {
                done(e);
            });

        } catch (e){
            sails.log.error('SyncFactory._folderSync.syncPublic() Exception - ' + e.message);
            done(e.message);
        }// try-catch
    },

    syncMember: function (done) {

        sails.log.debug('SycFactory syncMember() starting');

        try {

            var type = FolderCache.folderTypes.member;
            var root = sails.config.egnyte.root + type;

            // sync root and categories within
            _folderSync.syncRoot(root, type, '', '', false, true).then(function (results) {
                done();
            }).fail(function (e) {
                done(e);
            });
            
        } catch (e){
            sails.log.error('SyncFactory._folderSync.syncMember() Exception - ' + e.message);
            done(e.message);
        }// try-catch

 
    },

    syncCompany: function (done) {

        sails.log.debug('SyncFactory._folderSync.syncCompany() Retrieving companies for sync');

        try {
            var type = FolderCache.folderTypes.company;
            var root = sails.config.egnyte.root + type;

            // get companies
            _folderSync.syncRoot(root, type, '', '', false, true, 'home').then(function (results) {

                done();
           
            }).fail(function (e) {

                sails.log.info('SyncFactory._folderSync.syncCompany() - Company sync exception ' + e);
                done(e);
            });

        } catch (e) {
            
            sails.log.error('SyncFactory._folderSync.syncCompany() Exception - ' + e.message);
            done(e.message);

        }// try-catch
    },

    syncCommittee: function (done) {

        sails.log.debug('SyncFactory._folderSync.syncCommittee() Retrieving committees for sync');

        try {
            var type = FolderCache.folderTypes.committee;
            var root = sails.config.egnyte.root + type;

            // get committees but don't cache yet
            _folderSync.syncRoot(root, type, '', '', false, false).then(function (results) {

                if (results.success && results.data.folders && results.data.folders.length > 0) {
                    // iterate committees
                    async.eachSeries(results.data.folders, function (folder, folderCallback) {

                        setTimeout(function () {
                            // cache committee root and categories
                            _folderSync.syncRoot(root + '/' + folder.name, type, folder.name, folder.name, true, true, 'committee')
                                .then(function (results) {
                                    
                                    folderCallback();
                                });
                        }, _timeout);

                    }, function (e) {
                        if (e) {
                            // error occurred
                            sails.log.error('SyncFactory._folderSync.syncCommittee() Exception() - ' + e);
                            done(e);
                        } else {

                            sails.log.info('SyncFactory._folderSync.syncCommittee() committees cached');
                            done();

                        }// if-else
                    });

                } else {

                    sails.log.info('SyncFactory._folderSync.syncCommittee() - No committees to sync');
                    done();
                }// if-else

            }).fail(function (e) {

                sails.log.info('SyncFactory._folderSync.syncCommittee() - Committees sync exception ' + e);
                done(e);
            });

        } catch (e) {

            sails.log.error('SyncFactory._folderSync.syncCommittee() Exception - ' + e.message);
            done(e.message);

        }// try-catch
    },

    syncAll: function () {

        var promise = q.Promise(function (resolve, reject, inform) {

            try {

                var now = new Date();

                // sync all
                async.series([_folderSync.syncPublic, _folderSync.syncMember, _folderSync.syncCommittee, _folderSync.syncCompany],
                function (err, results) {
                            
                    if (err) {
                        reject(err);
                    } else {

                        console.log(now.toISOString());

                        // sync is done - now delete old records that was not updated
                        _folderSync.clean(now).then(function () {
                            sails.log.info('SyncFactory._folderSync.syncAll() Clean-up completed');

                            resolve({ success: true, results: results, message: 'Folder cache successfully synced' });
                        }).fail(function (e) {
                            sails.log.warn('SycFactory._folderSync.syncAll() Clean-up failed - ' + e);

                            resolve({ success: true, results: results, message: 'Folder cache successfully synced' });
                        });

                    }// if-else
                        
                });
            } catch (e) {

                sails.log.error('SyncFactory._folderSync.syncAll() Exception - ' + e.message);

                reject('SyncFactory.syncAll() Exception - ' + e.message);
            }// try-catch

        });

        return promise;
    },

    clear: function () {
        // clear folder cache
        return FolderCache.destroy();

    },

    checkForUpdates: function (callback) {


            FileStoreFactory.pollLastEvent().then(function (results) {


                if (results.success) {

                    // check for previous event 
                    var hasUpdates = false;

                    Cache.findOne({ key: 'eventCursor' }).exec(function cb(e, doc) {

                        sails.log.info('got event document');
                        if (e) {
                            sails.log.error('SyncFactory.checkForUpdates Exception - ' + e);
                            throw e;
                        } else {

                            if (doc && doc.value) {

                                // check if previous event changed
                                hasUpdates = doc.value.latest_event_id != results.data.latest_event_id;
                            } else {
                                // first time, return true
                                hasUpdates = true;
                            }// if-else

                        }// if

                        // save event to cache
                        Cache.upsert('eventCursor', results.data, function (e) {

                            sails.log.debug('SyncFactory.checkForUpdates() - Has updates ' + hasUpdates);
                            callback(hasUpdates);
                        });

                    });

                } else {
                    sails.log.warn('SyncFactory.checkForUpdates() - Unable to poll for last event');
                    callback(false);
                }// if-else


            });



    }

};


module.exports = {

    // sync once
    sync: _folderSync.syncAll,

    // empty sync cache
    empty: _folderSync.clear,

    updateCheck: _folderSync.checkForUpdates

};