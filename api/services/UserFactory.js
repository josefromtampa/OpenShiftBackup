
/*
    Name: UserFactory.js
    Description: This module handles user authentication service and user resources actions.

*/

var q = require('q');

module.exports = {
    
    // get user list
    getUsers: function () {

        var promise = q.Promise(function (resolve, reject, inform) {

            try {

                // get list of users
                SalesForce.getUsers().then(function (users) {

                    // TODO: do stuff with user list

                    resolve(users);

                }, function (e) {
                    reject(e);
                });

            } catch (e) {
                sails.log.error('UserFactory.getUsers() Exception - ' + e.message);
                reject(e.message);
            }// try-catch

        });

        return promise;

    }

};