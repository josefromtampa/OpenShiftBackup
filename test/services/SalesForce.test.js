'use strict';

var assert = require('assert');
var Sails = require('sails');

describe('SalesForce Service', function () {



    this.timeout(20000);

    // authenticate user
    it('should successfully authenticate user', function (done) {

        var username = 'kbeatty@veriskclimate.com',
            password = 'prepare12';

        sails.services.salesforce.authenticateUser(username, password)
            .then(function (results) {

                sails.log.info('UNITTEST: SalesForce authenticateUser() - ' + JSON.stringify(results));

                if (results.success) {
                    assert(true, 'User authenticated');
                } else {
                    assert(false, 'User authentication failed');
                }// if-else

                done();

            }, function (e) {
                sails.log.error('SalesForce authentication failed ' + e);
                throw ('SalesForce authentication failed ' + e);
            });
    });

    it('should not authenticate user', function (done) {

        var username = 'dummyuser@dummy.com',
            password = 'dummypassword';

        sails.services.salesforce.authenticateUser(username, password)
            .then(function (results) {

                sails.log.info('UNITTEST: SalesForce authenticateUser() - ' + JSON.stringify(results));

                if (results.success) {
                    assert(false, 'User authenticated which was not supposed to');
                } else {
                    assert(true, 'User authentication prevention succeeded');
                }// if-else

                done();

            }, function (e) {
                sails.log.error('SalesForce authentication prevention failed ' + e);
                throw ('SalesForce authentication prevention failed ' + e);
            });
    });

    // get users
    it('should get member list', function (done) {


        sails.services.salesforce.getUsers()
            .then(function (results) {

                sails.log.info('UNITTEST: SalesForce getUsers() got ' + results.members.length + ' members');

                if (results.success) {
                    assert(true, 'Got SalesForce member list');
                } else {
                    assert(false, 'Retrieve SalesForce member list failed');
                }// if-else

                done();

            }, function (e) {
                sails.log.error('SalesForce get member list failed ' + e);
                throw ('SalesForce get member list failed ' + e);
            });
    });

    // get companies
    it('should get companies in SalesForce', function (done) {


        sails.services.salesforce.getCompanies()
            .then(function (results) {

                sails.log.info('UNITTEST: SalesForce getCompanies() got ' + results.companies.length + ' companies');

                if (results.success) {
                    assert(true, 'Got SalesForce companies');
                } else {
                    assert(false, 'Retrieve SalesForce company list failed');
                }// if-else

                done();

            }, function (e) {
                sails.log.error('SalesForce get company list failed ' + e);
                throw ('SalesForce get company list failed ' + e);
            });
    });

    // get committees
    it('should get committees in SalesForce', function (done) {


        sails.services.salesforce.getCommittees()
            .then(function (results) {

                sails.log.info('UNITTEST: SalesForce getCommittees() got ' + results.committees.length + ' committees');

                if (results.success) {
                    assert(true, 'Got SalesForce committees');
                } else {
                    assert(false, 'Retrieve SalesForce committee list failed');
                }// if-else

                done();

            }, function (e) {
                sails.log.error('SalesForce get committee list failed ' + e);
                throw ('SalesForce get committee list failed ' + e);
            });
    });


    // log activity
    it('should log an activity to SalesForce', function (done) {

        var action = 'download',
            user = 'tsetuser',
            resource = 'testfile.pdf';

        sails.services.salesforce.logAction(action, user, resource)
            .then(function (results) {

                sails.log.info('UNITTEST: SalesForce logAction() returned');

                if (results.success) {
                    assert(true, 'Successfully logged activity action to SalesForce');
                } else {
                    assert(false, 'Logging activity action to SalesForce failed');
                }// if-else

                done();

            }, function (e) {
                sails.log.error('Logging activity action to SalesForce failed ' + e);
                throw ('Logging activity action to SalesForce failed ' + e);
            });
    });


 

});