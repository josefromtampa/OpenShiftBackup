/**
 * AdminController
 *
 * @description :: Server-side logic for managing Admins
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    syncFileStore: function (req, res) {

        try {

            SyncFactory.sync()
                .then(function (results) {
                    sails.log.info('Sync completed');
                    res.jsonp({ success: true });

                }, function (e) {
                    sails.log.error('Folder cache sync failed - ' + e);
                    res.jsonp({ success: false });
                });


        } catch (e) {
            sails.log.error('AdminController.syncFileStore() Exception - ' + e.message);
            res.serverError(e.message);
        }// try-catch
    }
	
};

