/**
 * UIController
 *
 * @description :: Server-side logic for managing UIS
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var fs = require('fs');
var passport = require('passport');

var _cache = (function(){

    var _fileListPage = '';
    var _membersPage = '';
    var _riskUploadPage = '';

    // preload pages
    _fileListPage = fs.readFileSync('./views/admin/filelist.html');
    _membersPage = fs.readFileSync('./assets/ibhs/members.html');
    _riskUploadPage = fs.readFileSync('./views/admin/riskupload.html');

    return {
        fileListPage: _fileListPage,
        membersPage: _membersPage,
        riskUploadPage: _riskUploadPage
    };

})();

module.exports = {

    getView: function (req, res) {

        try {
            
            var viewName = req.params.viewname;
            var user = req.tokenSession.owner; // get user from validated session in sessionAuth policy

            // get view
            View.findOne({ name: viewName }).exec(function (e, result) {
                if (e) {
                    sails.log.error('UIController.getView() DB Exception - ' + e);
                    res.serverError({ error: e });
                } else {

                    if (result) {
                        sails.log.debug('UIController.getView() Retrieved view');

                        var view = {
                            name: result.name,
                            showMenu: result.showMenu,
                            showSearch: result.showSearch,
                            categories: result.categories,
                            defaultCategory: result.defaultCategory
                        };

                        // get files and add
                        FileCacheFactory.get(view, user)
                            .then(function (results) {

                                sails.log.debug('UIController.getView() FileCacheFactory.get() Groups retrieved');
                                if (results.success) {
                                    view.groups = results.data;
                                }// if-else

                                res.jsonp({ success: true, data: view });
                            }, function (e) {
                                sails.log.error('UIController.getView() FileCacheFactory.get() Exception - ' + e);
                                res.serverError({ error: e });
                            });

                    } else {
                        sails.log.warn('UIController.getView() View not found for "' + view + '"');
                        res.jsonp({ success: false }); // no results
                    }// if-else
                }// if-else
            });


        } catch (e) {
            
            sails.log.error('UIController.getView() Exception - ' + e.message);
            res.serverError({ error: e.message });

        }// try-catch

    },

    getFileListPage: function (req, res) {

        try {
                                   
            // send page
            res.setHeader('Content-Type', 'text/html');
            res.send(_cache.fileListPage);
                       
        } catch (e) {
            sails.log.error('UIController.getFileListPage() Exception - ' + e.message);
            res.serverError(e.message);
        }// try-catch
        
    },

    getMembersPage: function (req, res) {

        try {

            // send page
            res.setHeader('Content-Type', 'text/html');
            res.send(_cache.membersPage);

        } catch (e) {
            sails.log.error('UIController.getMembersPage() Exception - ' + e.message);
            res.serverError(e.message);
        }// try-catch
    },

    getRiskUploadPage: function (req, res) {

        try {

            // send page
            res.setHeader('Content-Type', 'text/html');
            res.send(_cache.riskUploadPage);

        } catch (e) {
            sails.log.error('UIController.getRiskUpload() Exception - ' + e.message);
            res.serverError(e.message);
        }// try-catch
    }

    
	
};

