/**
 * AppController
 *
 * @description :: Server-side logic for managing App authentication
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var clientAuth = require('../handlers/ClientAuth.js');

module.exports = {
        
    authorize: clientAuth.authorize,

    logAction: function (req, res) {

        try {
            
            Logger.log(req.query.action, req.query.user);

            res.jsonp({ success: true, message: 'Action logged' });

        } catch (e) {
            res.serverError({ error: e.message });
        }// try-catch

    },

    
    getUsers: function (req, res) {

        try {

            UserFactory.getUsers().then(function (results) {
                
                res.jsonp({ success: true, data: results });


            }, function (e) {
                res.serverError({ error: e });
            });

        } catch (e) {
            res.serverError({ error: e.message });
        }// try-catch

    }
	
};

