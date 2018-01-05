'use strict';

var assert = require('assert');
var Sails = require('sails');

var _testingComponent = 'FileCacheFactory';
var _func = '';
var _action = '';

describe('File Cache Factory', function () {


    this.timeout(10000);

    _action = 'retrieve file cache for ALL view';
    it('should ' + _action, function (done) {

        var view = {
            "name": "all",
            "showMenu": true,
            "showSearch": true,
            "defaultCategory": "all",
            "categories": [{
                "name": "all",
                "display": "All",
                "icon": "images/all.png",
                "isRisk": false
            }, {
                "name": "home",
                "display": "Home",
                "icon": "images/home.png",
                "isRisk": false
            }, {
                "name": "general",
                "display": "General",
                "icon": "images/general.png",
                "isRisk": false
            }, {
                "name": "earthquake",
                "display": "Earthquake",
                "icon": "images/earthquake.png",
                "isRisk": true
            }, {
                "name": "flood",
                "display": "Flood",
                "icon": "images/flood.png",
                "isRisk": true
            }, {
                "name": "freeze",
                "display": "Freeze",
                "icon": "images/freeze.png",
                "isRisk": true
            }, {
                "name": "hail",
                "display": "Hail",
                "icon": "images/hail.png",
                "isRisk": true
            }, {
                "name": "hurricane",
                "display": "Hurricane",
                "icon": "images/hurricane.png",
                "isRisk": true
            }, {
                "name": "lightning",
                "display": "Lightning",
                "icon": "images/lightning.png",
                "isRisk": true
            }, {
                "name": "tornado",
                "display": "Tornado",
                "icon": "images/tornado.png",
                "isRisk": true
            }, {
                "name": "water",
                "display": "Water Intrusion",
                "icon": "images/water.png",
                "isRisk": true
            }, {
                "name": "wildfire",
                "display": "Wildfire",
                "icon": "images/wildfire.png",
                "isRisk": true
            }, {
                "name": "wind",
                "display": "High Wind",
                "icon": "images/wind.png",
                "isRisk": true
            }],
            "active": true
        };

        var user = {
            "id": "003j0000008xG56AAE",
            "name": "Kyle Beatty",
            "username": "kbeatty@veriskclimate.com",
            "membershipLevel": "Associate - Class IV",
            "isRACMember": true,
            "company": {
                "id": "001j000000Fj97oAAB",
                "name": "AAA Mid-Atlantic Insurance Company",
                "inRAC": true
            },
            "committees": [{
                "id": "a0fj0000000jRtSAAU",
                "name": "IBHS Research Advisory Council"
            }, {
                "id": "a0fj0000000jRteAAE",
                "name": "IBHS Board of Directors",
                role: 'Chairman'
            }
            ],
            "groups": ["Associate - Class IV", "RAC", "Verisk Climate - 001j000000Fj97oAAB", "IBHS Research Advisory Council - a0fj0000000jRtSAAU", "IBHS Actuarial and Data Subcommittee - a0fj0000000jRteAAE"]
        };



        _func = 'get';

        sails.services.filecachefactory.get(view, user)
            .then(function (results) {

                sails.log.info('UNITTEST: ' + _testingComponent + ' ' + _func + '()');

                if (results.success) {
                    assert(true, 'SUCCESS: ' + _action);
                } else {
                    assert(false, 'FAILED: ' + _action);
                }// if-else

                done();

            }, function (e) {
                sails.log.error('UNITTEST: ' + _testingComponent + ' ' + _func + '() Failed - ' + e);
                throw ('FAILED: ' + _action + ' - ' + e);
            });
    });

    _action = 'get file'
    it('should ' + _action, function (done) {

        _func = 'getFile';

        var entryId = 'bdc692c9-61b3-4555-ad71-4cfff04896f4';

        sails.services.filecachefactory.getFile(entryId)
            .then(function (results) {

                sails.log.info('UNITTEST: ' + _testingComponent + ' ' + _func + '() got ' + JSON.stringify(results));

                if (results) {
                    assert(true, 'SUCCESS: ' + _action);
                } else {
                    assert(false, 'FAILED: ' + _action);
                }// if-else

                done();

            }, function (e) {
                sails.log.error('UNITTEST: ' + _testingComponent + ' ' + _func + '() Failed - ' + e);
                throw ('FAILED: ' + _action + ' - ' + e);
            });
    });

    _action = 'get all folders'
    it('should ' + _action, function (done) {

        _func = 'getFolders';

        sails.services.filecachefactory.getFolders()
            .then(function (results) {

                sails.log.info('UNITTEST: ' + _testingComponent + ' ' + _func + '() got ' + results.length + ' folders');

                if (results) {
                    assert(true, 'SUCCESS: ' + _action);
                } else {
                    assert(false, 'FAILED: ' + _action);
                }// if-else

                done();

            }, function (e) {
                sails.log.error('UNITTEST: ' + _testingComponent + ' ' + _func + '() Failed - ' + e);
                throw ('FAILED: ' + _action + ' - ' + e);
            });
    });
});
