/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 * 
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  // models: {
  //   connection: 'someMongodbServer'
  // }

  controllers: {

    actions: true,
    shortcuts: true,
    rest: true
  },

  connections: {

    cacheServer: {
        adapter: 'sails-mongo',
        host: 'ds049641.mongolab.com',
        port: 49641,
        database: 'ibhs_prod',
        user: 'ibhs_prod_user',
        password: 'S7TzSfcKdtFE',
      //host: 'ds049641.mongolab.com',
      //port: 49641,
      //database: 'ibhs_dev',
      //user: 'ibhs_dev_user',
      //password: 'gCScdwu46VJ7'
    }
  },

  email: {
    host: 'server.poeticfolly.com',
    secure: true,
    port: 465,
    auth: {
      user: 'errors@mytestingspot.com',
      pass: '1qazse$R%T'
    },
    tls: {
      rejectUnauthorized: false
    }
  },

};
