/*
    Name: LogFactory.js
    Description: This module encapsulates the activity logging functionality.
*/

var request = require('request');
var q = require('q');

var _log = {

    log: function () {

        try {

            // log to salesforce
            SalesForce.logAction();

            // do additional log if needed


        } catch (e) {
            sails.log.error('Logger._log.log() Exception - ' + e.message);
        }// try-catch

    }
};

module.exports = {

    // log method
    log: _log.log

};

// static types
module.exports.types = {
    download: 'DOWNLOAD',
    view: 'VIEW',
    list: 'LISTVIEW'
};