'use strict';

var assert = require('assert');
var Sails = require('sails');

describe('APIClient Model Test', function () {

    this.timeout(6000);


    it('should create a api client', function (done) {

        sails.models.apiclient.create({ clientId: 'bob', secret: 'password', type: 'test' }).exec(function (e, results) {

            sails.log.info('UNITTEST: APIClient create completed ' + JSON.stringify(results));

            if (e) {
                assert(false, 'API client create failed');
            } else {

                assert(true, 'API client create succeeded');
            }// if-else

            done();
        });

    });

    it('should validate api client', function (done) {


        sails.models.apiclient.validateClient('bob', 'password').then(function (account) {

            sails.log.info('UNITTEST: APIClient validate completed ' + JSON.stringify(account));

            if (account) {
                assert(true, 'Client validation succeeded');
            } else {
                assert(false, 'Client validation failed');
            }// if-else

            done();

        }, function (e) {
            throw 'Client validation failed ' + e;
        });



    });

    it('should clear all test api client', function (done) {


        sails.models.apiclient.destroy({ type: 'test'}).exec(function (e, results) {

            sails.log.info('UNITTEST: APIClient test cleanup completed ' + JSON.stringify(results));

            if (results) {
                assert(true, 'Test clients cleanup succeeded');
            } else {
                assert(false, 'Test clients cleanup failed');
            }// if-else

            done();

        }, function (e) {
            throw 'Test clients cleanup failed ' + e;
        });



    });

});