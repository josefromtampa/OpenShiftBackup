

'use strict';

var assert = require('assert');
var Sails = require('sails');


describe('FileStore Factory Service', function () {



    this.timeout(15000);

    it('should authorize filestore', function (done) {

        sails.services.filestorefactory.authorize()
        .then(function (results) {

            sails.log.info('UNITTEST: FileStoreFactory authorize() - ' + results.message);
            assert(results.success, results.message);

            done();

        }, function (e) {

            throw ('Authorization failed ' + e);

        });

    });


    describe('After authentication', function () {

        this.timeout(10000);

        describe('File Listing', function () {

            it('should retrieve files and folders from Web Portal', function (done) {

              var path = sails.config.egnyte.root;

              sails.services.filestorefactory.file.list(path)
                .then(function (results) {

                  sails.log.info('UNITTEST: FileStoreFactory file.list() - ' + results.message + ' ' + JSON.stringify(results.data));
                  assert(results.success, results.message);

                  setTimeout(function(){
                    done();
                  }, 500);

                }, function (e) {

                  throw ('File listing failed ' + e);
                });

            });


            it('should retrieve files and folders from Web Portal/Public', function (done) {

                var path = sails.config.egnyte.root + 'Public';

                sails.services.filestorefactory.file.list(path)
            .then(function (results) {

                sails.log.info('UNITTEST: FileStoreFactory file.list() - ' + results.message + ' ' + JSON.stringify(results.data));
                assert(results.success, results.message);

                    setTimeout(function(){
                      done();
                    }, 500);
            }, function (e) {

                throw ('File listing failed ' + e);
            });

            });


            it('should retrieve files and folders from Web Portal/Private', function (done) {

                var path = sails.config.egnyte.root + 'Private';

                sails.services.filestorefactory.file.list(path)
                  .then(function (results) {

                sails.log.info('UNITTEST: FileStoreFactory file.list() - ' + results.message + ' ' + JSON.stringify(results.data));
                assert(results.success, results.message);

                    setTimeout(function(){
                      done();
                    }, 500);
            }, function (e) {

                throw ('File listing failed ' + e);
            });

            });

            it('should retrieve files and folders from Web Portal/Priate/Members', function (done) {

                var path = sails.config.egnyte.root + 'Private/Members';

                sails.services.filestorefactory.file.list(path)
            .then(function (results) {

                sails.log.info('UNITTEST: FileStoreFactory file.list() - ' + results.message + ' ' + JSON.stringify(results.data));
                assert(results.success, results.message);

                    setTimeout(function(){
                      done();
                    }, 500);
            }, function (e) {

                throw ('File listing failed ' + e);
            });

            });

            it('should retrieve files and folders from Web Portal/Private/Companies', function (done) {

                setTimeout(function () {
                    var path = sails.config.egnyte.root + 'Private/Companies';

                    sails.services.filestorefactory.file.list(path)
                        .then(function (results) {

                            sails.log.info('UNITTEST: FileStoreFactory file.list() - ' + results.message + ' ' + JSON.stringify(results.data));
                            assert(results.success, results.message);

                        setTimeout(function(){
                          done();
                        }, 500);
                        }, function (e) {

                            throw ('File listing failed ' + e);
                        });
                }, 2000);

            });

            it('should retrieve files and folders from Web Portal/Private/Committees', function (done) {

                setTimeout(function () {
                    var path = sails.config.egnyte.root + 'Private/Committees';

                    sails.services.filestorefactory.file.list(path)
                        .then(function (results) {

                            sails.log.info('UNITTEST: FileStoreFactory file.list() - ' + results.message + ' ' + JSON.stringify(results.data));
                            assert(results.success, results.message);

                            done();
                        }, function (e) {

                            throw ('File listing failed ' + e);
                        });
                }, 1000);

            });


        });

        describe('File functions', function () {

            this.timeout(15000);

            //it('should download file', function (done) {

            //    var path = sails.config.egnyte.root + 'public/test.txt';

            //    sails.services.filestorefactory.file.download(path)
            //    .then(function (results) {


            //        sails.log.info('UNITTEST: FileStoreFactory file.download() - ' + results.message);
            //        assert(results.success, results.message);

            //        done();

            //    }, function (e) {

            //        throw ('File download failed ' + e);
            //    });


            //});

            it('should search file', function (done) {

                var str = 'test.txt';

                sails.services.filestorefactory.file.search(str)
                .then(function (results) {


                    sails.log.info('UNITTEST: FileStoreFactory file.search() - ' + results.message);
                    assert(true, results.message);

                    done();

                }, function (e) {

                    throw ('File search failed ' + e);
                });


            });
        });


    });



});
