'use strict';

var assert = require('assert');
var Sails = require('sails');

describe('TokenSession Model Test', function () {

    this.timeout(6000);

    var curSession = null;
    var session2 = null;

    it('should grant a session', function (done) {

        var user = {
            fname: 'user1',
            lname: 'test',
            address: '123 South Central',
            city: 'Cloud City',
            state: 'FL'
        };


        sails.models.tokensession.grant('user', user).then(function (session) {

            if (session) {
                curSession = session;
                sails.log.info('UNITTEST: TokenSession grant succeeded ' + JSON.stringify(session));
                assert(true, 'Token grant succeeded');
            } else {
                sails.log.error('UNITTEST: TokenSession grant failed');
                assert(false, 'Token grant failed');
            }// if-else

            done();

        }, function (e) {
            throw 'Token grant failed ' + e;
        });


       
    });

    it('should grant another session', function (done) {

        var user = {
            fname: 'user2',
            lname: 'test',
            address: '123 South Central',
            city: 'Cloud City',
            state: 'FL'
        };


        sails.models.tokensession.grant('user', user).then(function (session) {

            if (session) {
                session2 = session;
                sails.log.info('UNITTEST: TokenSession grant succeeded ' + JSON.stringify(session));
                assert(true, 'Token grant succeeded');
            } else {
                sails.log.error('UNITTEST: TokenSession grant failed');
                assert(false, 'Token grant failed');
            }// if-else

            done();

        }, function (e) {
            throw 'Token grant failed ' + e;
        });

    });

    it('should validate session', function (done) {
        
        sails.models.tokensession.validateSession(curSession.clientToken).then(function (results) {

            if (results.success) {
                sails.log.info('UNITTEST: TokenSession validation succeeded ');
                assert(true, 'Token validation succeeded');
            } else {
                sails.log.error('UNITTEST: TokenSession validation failed');
                assert(false, 'Token validation failed');
            }// if-else

            done();

        }, function (e) {
            throw 'Token validation failed ' + e;
        });
    });

    it('should expire session without removing', function (done) {

        sails.models.tokensession.expire(curSession.clientToken, false).then(function (results) {

            if (results.success) {
                sails.log.info('UNITTEST: TokenSession expire succeeded ');
                assert(true, 'Token expire succeeded');
            } else {
                sails.log.error('UNITTEST: TokenSession expire failed');
                assert(false, 'Token expire failed');
            }// if-else

            done();

        }, function (e) {
            throw 'Token expire failed ' + e;
        });
    });

    it('should clean expired sessions', function (done) {

        sails.models.tokensession.clean().then(function (results) {

            if (results.success) {
                sails.log.info('UNITTEST: TokenSession clean succeeded ');
                assert(true, 'Token clean succeeded');
            } else {
                sails.log.error('UNITTEST: TokenSession clean failed');
                assert(false, 'Token clean failed');
            }// if-else

            done();

        }, function (e) {
            throw 'Token clean failed ' + e;
        });
    });

    it('should clean test sessions', function (done) {

        sails.models.tokensession.destroy({ "owner.lname": 'test' }).exec(function (e) {

            if (e) {
                sails.log.error('UNITTEST: TokenSession clean failed');
                assert(false, 'Token clean failed');
            } else {
                sails.log.info('UNITTEST: TokenSession clean succeeded ');
                assert(true, 'Token clean succeeded');
            }// if-else

            done();

        }, function (e) {
            throw 'Token clean failed ' + e;
        });
    });


});