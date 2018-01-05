/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
   * etc. depending on your default view engine) your home page.              *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  '/': {
    view: 'dummy'
  },

  '/admin': {
    view: 'home'
  },

  '/riskmap': {
    view: 'riskmap',
    locals: {
      layout: null
    }
  },

  /***************************************************************************
   *                                                                          *
   * Custom routes here...                                                    *
   *                                                                          *
   *  If a request to a URL doesn't match any of the custom routes above, it  *
   * is matched against Sails route blueprints. See `config/blueprints.js`    *
   * for configuration options and examples.                                  *
   *                                                                          *
   ***************************************************************************/


  // get list of files based on category (optional), company (optional), committee (includeflag), and role

  /*** UI Routes ***/

    // get view
    'GET /ui/view/:viewname/:access_token': {
        controller: 'UIController',
        action: 'getView',
        skipAssets: true
    },
    'GET /ui/filelist': 'UIController.getFileListPage',
    'GET /members/:access_token': 'UIController.getMembersPage',
    'GET /admin/riskupload': 'UIController.getRiskUploadPage',



  /*** File Store Routes ***/

    // download file
    'GET /filestore/download/:access_token/*': 'FileStoreController.download',
    'GET /filestore/preview/:access_token/*': 'FileStoreController.preview',
    'GET /filestore/stream/:access_token/*': 'FileStoreController.stream',
    'GET /filestore/folders/:access_token': 'FileStoreController.getFolders',
    'GET /filestore/:fileid/:access_token': 'FileStoreController.getFile',

  /*** User & Auth Routes ***/

  // app routes
  'POST /app/auth': 'AppController.authorize',
  'POST /app/log': 'AppController.logAction',
  'GET /app/users': 'AppController.getUsers',


  // user routes
  'POST /portal': 'UserController.login',
  'GET /user/logout/:access_token': 'UserController.logout',


  /*** Disaster Query Routes ***/
  'GET /disastersafety/risks/region/:regionCode': 'DisasterQueryController.byRegion',
  'GET /disastersafety/risks/zipcode/:zipCode': 'DisasterQueryController.byZipCode',
  'POST /disastersafety/risks/upload': 'DisasterUploadController.upload',

    /*** Admin Routes ***/
    'GET /admin/syncstore/:access_token': 'AdminController.syncFileStore'

};
