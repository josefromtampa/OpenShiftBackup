/**
 * FileStoreController
 *
 * @description :: Server-side logic for managing backend resource storage
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var stream = require('stream');

var _fileStore = {

    getFile: function (req, res) {

        try {
            var id = req.params.fileid;

            // find file
            FileCacheFactory.getFile(id).then(function (file) {

                if (file){
                    res.jsonp({success: true, data: file });
                } else {
                    res.jsonp({ success: false, message: 'File not found'});
                }// if-else

            }).fail(function (e) {
                sails.log.error('FileStoreController.getFile() Unable to retrieve folders - ' + e);
                res.serverError(e);
            });

        } catch (e) {
            sails.log.error('FileStoreController.getFile() Exception - ' + e.message);
            res.serverError('Unable to retrieve file');
        }// try-catch

    },

    getFolders: function (req, res) {

        try {

            FileCacheFactory.getFolders().then(function (folders) {

                if (folders) {
                    res.jsonp({ success: true, data: folders });
                } else {
                    res.jsonp({ success: true, data: null });
                }// if-else
                
            }).fail(function (e) {
                sails.log.error('FileStoreController.getFolders() Unable to retrieve folders - ' + e);
                res.serverError(e);
            });

        } catch (e) {
            sails.log.error('FileStoreController.getFolders() Exception - ' + e.message);
            res.serverError('Unable to retrieve folders');
        }// try-catch

    },

    download: function (req, res) {

        try {

            // get wildcard param for path
            var filePath = req.params[0];

            sails.log.debug('FileStoreFactory.download() Downloading file ' + filePath);
        
            // log action
            SalesForce.logAction('download', req.tokenSession.owner.name, filePath);

            // call method and pipe file response back
            //FileStoreFactory.file.download(filePath).pipe(res);

            // call method and pipe file response back
            var lastIdx = filePath.lastIndexOf('/');
            var file = filePath.substring(lastIdx + 1);
            sails.log.info('Setting file header for ' + file);
            res.setHeader('Content-disposition', 'attachment; filename=' + file);
            
            FileStoreFactory.file.get(filePath)
                .then(function (fileRes) {

                    // pipe response back
                    fileRes.pipe(res, { end: true })
                        .on('finish', function () {
                            sails.log.info('File download finished transferring');
                        });
                    fileRes.resume();

                }, function (e) {
                    sails.log.error('FormController.getImage() - Get image failed ' + JSON.stringify(e));
                    res.serverError({ error: 'Unable to retrieve file' });

                });

        } catch(e) {
            sails.log.error('FileStoreController.download() Exception - ' + e.message);
            res.serverError('Unable to download file');
        }// try-catch
    },

    preview: function (req, res) {

        try {

            // get wildcard param for path
            var filePath = req.params[0];

            // call method and pipe file response back
            FileStoreFactory.file.get(filePath)
                .then(function (fileRes) {

                    sails.log.info('Preview got response for ' + filePath);
                    // pipe response back
                    fileRes.pipe(res, { end: true })
                        .on('finish', function () {
                            sails.log.info('Preview file finished transferring ' + filePath);
                        });
                    sails.log.info('Preview response piped, now resuming');
                    fileRes.resume();


                }, function (e) {
                    sails.log.error('FormController.getImage() - Get image failed ' + JSON.stringify(e));
                    res.serverError({ error: 'Unable to retrieve file' });

                });

            //// call method and pipe file response back
            //FileStoreFactory.file.download(filePath).on('response', function (r) {

            //    if (r && r.headers && r.headers['content-disposition']) {
            //        // remove the "attachment" attribute from header so it does not trigger auto-download
            //        r.headers['content-disposition'] = r.headers['content-disposition'].replace('attachment;', '');
            //        r.headers['content-type'] = r.headers['content-type'].replace(';charset=UTF-8', '');
            //        delete r.headers['set-cookie'];
            //        delete r.headers['egnyte-etag'];
            //        delete r.headers['etag'];
            //        delete r.headers['x-egnyte-request-id'];
            //        delete r.headers['x-content-type-options'];
            //        delete r.headers['x-sha512-checksum'];
            //        delete r.headers['x-robots-tag'];
            //        delete r.headers['x-mashery-responder'];

            //    }// if-else

            //}).pipe(res);

        } catch (e) {
            sails.log.error('FileStoreController.preview() Exception ' + e.message);
            res.serverError('Unable to retrieve file preview');
        }// try-catch

    },

    stream: function (req, res) {
        
        // get wildcard param for path
        var filePath = req.params[0];
        var buffer = null;
        
        // call method and pipe file response back
        FileStoreFactory.file.download(filePath).on('response', function (r) {

            if (r && r.headers && r.headers['content-disposition']) {
                // remove the "attachment" attribute from header so it does not trigger auto-download
                r.headers['content-disposition'] = r.headers['content-disposition'].replace('attachment;', '');
                r.headers['content-type'] = r.headers['content-type'].replace(';charset=UTF-8', '');
                delete r.headers['set-cookie'];
                delete r.headers['egnyte-etag'];
                delete r.headers['etag'];
                delete r.headers['x-egnyte-request-id'];
                delete r.headers['x-content-type-options'];
                delete r.headers['x-sha512-checksum'];
                delete r.headers['x-robots-tag'];
                delete r.headers['x-mashery-responder'];

                r.on('data', function (chunk) {
                    if (buffer) {
                        buffer += chunk;
                    } else {
                        buffer = chunk;
                    }// if
                });

                r.on('end', function () {

                    res.writeHead(206, {
                        "Content-Range": "bytes " + start + "-" + end + "/" + total,
                        "Accept-Ranges": "bytes",
                        "Content-Length": buffer.length,
                        "Content-Type": "video/mp4"
                    });

                    var buffer = new Buffer('foo');
                    var bufferStream = new stream.PassThrough();
                    bufferStream.end(buffer);
                    bufferStream.pipe(res);
                });


            }// if-else

        }).pipe(res);


    }

};



module.exports = {

    download: _fileStore.download,
    preview: _fileStore.preview,
    stream: _fileStore.stream,
    getFolders: _fileStore.getFolders,
    getFile: _fileStore.getFile
};

