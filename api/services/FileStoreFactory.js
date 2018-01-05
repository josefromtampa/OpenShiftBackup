/*
*   FileStoreFactory.js
*   Desc: Common methods to filestore backend
*/
var pool = { maxSockets: 25 };
var maxSockets = 25;
var q = require('q');
var request = require('request');
var _overRateResposeRegex = new RegExp('developer over rate', 'i');


// initialize egnyte
var Egnyte = require('egnyte-js-sdk');
var egnyte = Egnyte.init(sails.config.egnyte.domain, {
    token: sails.config.egnyte.token
});

module.exports = {

    isReady: function(){

        return !CommonFactory.isNullOrEmpty(sails.config.egnyte.token);
    },

    authorize: function () {
        
        var promise = q.Promise(function (resolve, reject, notify) {


            if (CommonFactory.isNullOrEmpty(sails.config.egnyte.token)) {

                request.post({
                    url: sails.config.egnyte.domain + '/puboauth/token',
                    form: {
                        client_id: sails.config.egnyte.clientId,
                        username: sails.config.egnyte.account.username,
                        password: sails.config.egnyte.account.password,
                        grant_type: 'password'
                    },
                    json: true,
                    pool: { maxSockets: maxSockets }
                },
                   function (error, resp, results) {

                    try {
                        
                        sails.log.debug('FileStoreFactory.authorize() - FileStore factory response ' + JSON.stringify(results));

                        if (error != undefined || error != null || !error
                            && results != undefined && results != null && results != '') {
                            
                            if (results && results.access_token) {
                                // set token
                                sails.config.egnyte.token = results.access_token;
                                                                
                                resolve({ success: true, data: results.access_token, message: 'Token retrieved' });
                            } else {
                                resolve({ success: false, data: null, message: results.message });
                            }// if-else

                        } else {
                            resolve({ success: false, message: error });
                        }// if-else

                    } catch (e) {

                        sails.log.error('FileStoreFactory.authorize() Exception - ' + e.message);
                        reject('An error occurred while authorizing file store');
                    }// try-catch

                });

            } else {

                resolve({ success: true, message: 'Already authenticated' });
            }// if-else

        });

        return promise;

    },

    pollLastEvent: function(){
                
        var promise = q.Promise(function (resolve, reject, notify) {

            // build request
            var options = {
                url: sails.config.egnyte.domain + '/pubapi/v1/events/cursor',
                json: true,
                headers: {
                    Authorization: 'Bearer ' + sails.config.egnyte.token
                },
                pool: { maxSockets: maxSockets }
            };

            sails.log.debug('FileStoreFactory.pollLastEvent() options - ' + JSON.stringify(options));

            // do request
            request.get(options, function (error, resp, results) {

                try {

                    if (error || results === undefined) {
                        reject(error);
                    } else {
                        resolve({ success: true, data: results });
                    }// if-else

                } catch (e) {
                    sails.log.error('FileStoreFactory.pollLastEvent() Exception - ' + e.message);
                    reject('An error occurred polling for last event');

                }// try-catch

            });

        });

        return promise;
    },

    file: {

        list: function (path) {

            var promise = q.Promise(function (resolve, reject, notify) {

                try {

                    // GET  /pubapi/v1/fs/Shared/{Full Path to File/Folder}
                    // list_content - req
                    // allowed_link_types - op

                    // build request
                    var options = {
                        url: sails.config.egnyte.domain + '/pubapi/v1/fs/' + path,
                        json: true,
                        qs: {
                            list_content: true
                        },
                        headers: {
                            Authorization: 'Bearer ' + sails.config.egnyte.token
                        },
                        pool: { maxSockets: maxSockets }
                    };
                    
                    sails.log.debug('FileStoreFactory.file.list() options - ' + JSON.stringify(options));
                    
                    // do request
                    request.get(options, function (error, resp, results) {

                        try {

                            //sails.log.debug('FileStoreFactory.file.list() - FileStore factory response ' + JSON.stringify(results));

                            if (error || results == undefined) {
                                sails.log.error('FileStoreFactory.file.list() FileStore response error - ' + error);
                                reject({ success: false, data: null, message: error });
                            } else if (_overRateResposeRegex.test(results)) {
                                sails.log.warn('FileStoreFactory.file.list() Rate limit reached - ' + results);
                                reject({ success: false, data: null, message: results });
                            } else {

                                if (results.name) {
                                    resolve({ success: true, data: results, message: 'List retrieved' });
                                } else {
                                    resolve({ success: false, data: results, message: 'List not retrieved' });
                                }// if-else
                     
                            }// if-else

                        } catch (e) {
                            sails.log.error('FileStoreFactory.file.list() Exception - ' + e.message);
                            reject('An error occurred retrieving file listing for ' + path);

                        }// try-catch

                    });
                } catch (e) {
                    reject('FileStoreFactory.file.list() Exception for path "' + path + '" - ' + e.message);
                }// try-catch


            });

            return promise;

        },

        download: function (path) {
            
            //var promise = q.Promise(function (resolve, reject, notify) {

            sails.log.debug('FileStoreFactory.file.download() Downloading file ' + path);

                // GET  /pubapi/v1/fs-content/{Full Path to File}
                var options = {
                    url: sails.config.egnyte.domain + '/pubapi/v1/fs-content/' + path,
                    headers: {
                        'Authorization': 'Bearer ' + sails.config.egnyte.token
                    },
                    pool: { maxSockets: maxSockets },
                    headers: {
                        'Connection': 'close'
                    }
                };

                console.log('Requesting file: ', sails.config.egnyte.domain + '/pubapi/v1/fs-content/' + path);
                sails.log.debug('FileStoreFactory.file.download() Requesting file from ' + sails.config.egnyte.domain + '/pubapi/v1/fs-content/' + path);
                return request(options);

                //request(options, function (error, resp, results) {

                //    try {

                //        sails.log.debug('FileStoreFactory.file.download() - FileStore factory responded');

                //        if (error != undefined || error != null || !error
                //            && results != undefined && results != null && results != ''
                //            && resp.statusCode == 200) {

                //            resolve({ success: true, data: results, message: 'File retrieved' });

                //        } else {
                //            resolve({ success: false, data: null, message: error });
                //        }// if-else

                //    } catch (e) {
                //        sails.log.error('FileStoreFactory.file.downloadFile() Exception - ' + e.message);
                //        reject('An error occurred downloading file ' + path);

                //    }// try-catch

                //});

            //});

            //return promise;

        },
        
        get: function (path) {

            sails.log.info('Getting file ' + path);

            try {

                console.log('path is: ' + path);
                console.log('Final path', (path.indexOf('/') !== 0 ? '/' : '') + path);

                // get the stream of the file
                return egnyte.API.storage.getFileStream((path.indexOf('/') !== 0 ? '/' : '') + path);

            } catch (e) {
                sails.log.error('FileStoreFactory.file.get() Exception - ' + e.message);
                return q.reject({ message: 'File retrieval exception' });

            }// try-catc

        },

        search: function (searchStr, count, offset, folder, modifiedBefore, modifiedAfter) {

            var promise = q.Promise(function (resolve, reject, notify) {

                try {

                    // GET  /pubapi/v1/search
                    var options = {
                        url: sails.config.egnyte.domain + '/pubapi/v1/search',
                        json: true,
                        qs: {
                            query: encodeURIComponent(searchStr)
                        },
                        headers: {
                            'Authorization': 'Bearer ' + sails.config.egnyte.token
                        },
                        pool: { maxSockets: maxSockets }
                    };

                    // optional parameters
                    if (count > 0) {
                        options.qs.count = count;
                    }// if

                    if (offset >= 0) {
                        options.qs.offset = offset;
                    }// if

                    if (folder && folder != null && folder != '') {
                        options.qs.folder = folder;
                    }// if

                    if (modifiedBefore && modifiedBefore != null) {
                        options.qs.modified_before = modifiedBefore.toISOString();
                    }// if

                    if (modifiedAfter && modifiedAfter != null) {
                        options.qs.modified_after = modifiedAfter.toISOString();
                    }// if

                    // do request
                    request(options, function (error, resp, results) {

                        try {

                            sails.log.debug('FileStoreFactory.file.search() - FileStore factory responded with ' + JSON.stringify(results));

                            if (error != undefined || error != null || !error
                            && results != undefined && results != null && results != '') {

                                resolve({ success: true, data: results.results, message: 'Search completed' });

                            } else {
                                resolve({ success: false, data: null, message: error });
                            }// if-else

                        } catch (e) {
                            sails.log.error('FileStoreFactory.file.search() Exception - ' + e.message);
                            reject('An error occurred while searching file ' + searchStr);

                        }// try-catch

                    });

                } catch (e) {
                    sails.log.error('FileStoreFactory.file.search() Request exception - ' + e.message);
                    reject('An error occurred while searching file ' + searchStr);
                }// try-catch

            });

            return promise;
        }
    },

    folder: {

        create: function (path) {

            var promise = q.Promise(function (resolve, reject, notify) {

              
                // build request
                var options = {
                    url: sails.config.egnyte.domain + '/pubapi/v1/fs/Shared/Web Production/' + path,
                    json: {
                        action: 'add_folder'
                    },
                    headers: {
                        Authorization: 'Bearer ' + sails.config.egnyte.token
                    },
                    pool: { maxSockets: maxSockets }
                };

                sails.log.debug('FileStoreFactory.folder.create() options - ' + JSON.stringify(options));

                // do request
                request.post(options, function (error, resp, results) {

                    try {

                        //sails.log.debug('FileStoreFactory.folder.create() - FileStore factory response ' + JSON.stringify(resp));

                        if (error) {

                            sails.log.error('FileStoreFactory.folder.create() - Exception ' + error);
                            reject({ success: false, data: null, message: error });

                        } else {
                            resolve({ success: true, data: results, message: 'Folder created' });
                           
                        }// if-else

                    } catch (e) {
                        sails.log.error('FileStoreFactory.folder.create() Parse Exception - ' + e.message);
                        reject('An error occurred creating folder ' + path);

                    }// try-catch

                });


            });

            return promise;
        }
    }



    
};