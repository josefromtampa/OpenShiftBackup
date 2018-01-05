'use strict';

var assert = require('assert');
var Sails = require('sails');

describe('Sync Factory Service', function () {



    this.timeout(900000);

    it('should cache folders', function (done) {

        sails.services.syncfactory.sync()
            .then(function (results) {

                sails.log.info('UNITTEST: SyncFactory syncAll() - ' + JSON.stringify(results));

                if (results.success) {
                    assert(true, 'Folder sync succeeded');
                } else {
                    assert(false, 'Folder sync failed');
                }// if-else

                done();

            }, function (e) {
                sails.log.error('UNITTEST: SyncFactory syncAll() Failed - ' + e);
                throw ('Folder sync failed ' + e);
            });
    });

});
