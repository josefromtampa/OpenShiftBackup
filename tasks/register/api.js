

var Sails = require('sails'),
    sails,
    uuid = require('node-uuid');


module.exports = function (grunt) {

    grunt.registerTask('api-list', 'Shows the list of supported API tasks.', function () {

        grunt.log.writeln(' ');
        grunt.log.writeln('Supported Tasks');
        grunt.log.writeln('*************************************************************************************');
        grunt.log.writeln('api-generate-client:{clientId}:{secret}:{environment} ==> Generates a new api client');
        grunt.log.writeln('api-generate-views:{environment}                      ==> Initializes widget views');
        grunt.log.writeln('api-sync-foldercache:{environment}:{syncoverride}     ==> Syncs the folder cache from Egnyte');
    });

    grunt.registerTask('api-generate-client', 'Generates a new api client.', function (clientId, secret, env) {

        var done = this.async();

      if (arguments.length === 0) {
        grunt.log.writeln(this.name + ", no args");
        grunt.log.writeln('');
        grunt.log.writeln('Usage: grunt generate_api_client:{clientId}:{secret}:{environment}');

        done('Arguments required');
      } else {


          Sails.lift({
              port: 8181,
          log: {
            level: 'debug'
          },
          environment: env
        }, function (err, server) {
          sails = server;

          try {

            if (err) {
              grunt.log.error('*** ERROR - ' + err);
              done();
            } else {

              grunt.log.writeln('>>>>>> Generating new API key for client');

              sails.models.apiclient.create({
                clientId: clientId,
                secret: secret,
                type: 'client'
              }).exec(function (e, results) {

                sails.log.info('API Task: APIClient create done ' + JSON.stringify(results));

                if (e) {
                  sails.log.error('APIClient create failed ' + e);
                } else {

                  sails.log.info('APIClient create succeeded');
                }// if-else

                done();
              });


            }// if

          } catch (e) {
            sails.log.error('APIClient create exception - ' + e.message);
            done(e);
          }// try-catch

        });
      }// if-else

    });

    grunt.registerTask('api-generate-views', 'Initializes the widget views.', function (env) {

        var done = this.async();

        if (arguments.length === 0) {
            grunt.log.writeln(this.name + ", no args");
            grunt.log.writeln('');
            grunt.log.writeln('Usage: grunt generate_api_views:{environment}');

            done('Arguments required');
        } else {


            Sails.lift({
                port: 8181, 
                log: {
                    level: 'debug'
                },
                environment: env
            }, function (err, server) {
                sails = server;

                try {

                    if (err) {
                        grunt.log.error('*** ERROR - ' + err);
                        done();
                    } else {

                        grunt.log.writeln('>>>>>> Generating widget views');

                        /*
                            Views
                            1. home view - shows menu and home and committees categories, no search
                            2. research view - shows general, all risks, and fortified
                            3. Risk view - shows specified risk, no menu, no search
                            4. fortified view - shows fortified general and risks, no search
                            5. All view - shows, menu, search, and all categories
                            6. Commercial view - no menu, no search, only commercial category

                        */
                        var categories = {
                            all: {
                                name: 'all',
                                display: 'All',
                                icon: 'images/all.png',
                                isRisk: false
                            },
                            home: {
                                name: 'home',
                                display: 'Member Center',
                                icon: 'images/members.png',
                                isRisk: false
                            },
                            general: {
                                name: 'general',
                                display: 'Maintenance',
                                icon: 'images/general.png',
                                isRisk: false
                            },
                            committees: {
                                name: 'committees',
                                display: 'Committees',
                                icon: 'images/committees.png',
                                isRisk: false
                            },
                            commercial: {
                                name: 'commercial',
                                display: 'Commercial',
                                icon: 'images/commercial.png',
                                isRisk: false
                            },
                            fortified: {
                                name: 'fortified',
                                display: 'Fortified',
                                icon: 'images/fortified.png',
                                isRisk: false
                            },
                            earthquake: {
                                name: 'earthquake',
                                display: 'Earthquake',
                                icon: 'images/earthquake.png',
                                isRisk: true
                            },
                            flood: {
                                name: 'flood',
                                display: 'Flood',
                                icon: 'images/flood.png',
                                isRisk: true
                            },
                            freeze: {
                                name: 'freeze',
                                display: 'Freezing Weather',
                                icon: 'images/freeze.png',
                                isRisk: true
                            },
                            hail: {
                                name: 'hail',
                                display: 'Hail',
                                icon: 'images/hail.png',
                                isRisk: true
                            },
                            hurricane: {
                                name: 'hurricane',
                                display: 'Hurricane',
                                icon: 'images/hurricane.png',
                                isRisk: true
                            },
                            lightning: {
                                name: 'lightning',
                                display: 'Lightning',
                                icon: 'images/lightning.png',
                                isRisk: true
                            },
                            tornado: {
                                name: 'tornado',
                                display: 'Tornado',
                                icon: 'images/tornado.png',
                                isRisk: true
                            },
                            water: {
                                name: 'water',
                                display: 'Water Intrusion',
                                icon: 'images/water.png',
                                isRisk: true
                            },
                            wildfire: {
                                name: 'wildfire',
                                display: 'Wildfire',
                                icon: 'images/wildfire.png',
                                isRisk: true
                            },
                            wind: {
                                name: 'wind',
                                display: 'High Wind',
                                icon: 'images/wind.png',
                                isRisk: true
                            }

                        };
                        
                        var homeView = {
                            name: 'home',
                            showMenu: true,
                            showSearch: false,
                            defaultCategory: 'home',
                            categories: [categories.home, categories.committees],
                            active: true
                        };

                        var generalView = {
                            name: 'general',
                            showMenu: false,
                            showSearch: false,
                            defaultCategory: 'all',
                            categories: [categories.all, categories.general, categories.commercial],
                            active: true
                        };
                        var researchView = {
                            name: 'research',
                            showMenu: true,
                            showSearch: false,
                            defaultCategory: 'general',
                            categories: [
                                categories.general,
                                categories.earthquake,
                                categories.flood,
                                categories.freeze,
                                categories.hail,
                                categories.hurricane,
                                categories.lightning,
                                categories.tornado,
                                categories.water,
                                categories.wildfire,
                                categories.wind
                            ],
                            active: true
                        };
                        var fortifiedView = {
                            name: 'fortified',
                            showMenu: false,
                            showSearch: false,
                            defaultCategory: 'fortified',
                            categories: [
                                categories.fortified
                            ],
                            active: true
                        };
                        var commercialView = {
                            name: 'commercial',
                            showMenu: false,
                            showSearch: false,
                            defaultCategory: 'commercial',
                            categories: [
                                categories.commercial
                            ],
                            active: true
                        };
                        var allView = {
                            name: 'all',
                            showMenu: true,
                            showSearch: true,
                            defaultCategory: 'all',
                            categories: [
                                categories.all,
                                categories.home,
                                //categories.committees,
                                categories.general,
                                categories.commercial,
                                categories.fortified,
                                categories.earthquake,
                                categories.flood,
                                categories.freeze,
                                categories.hail,
                                categories.hurricane,
                                categories.lightning,
                                categories.tornado,
                                categories.water,
                                categories.wildfire,
                                categories.wind
                            ],
                            active: true
                        };

                        // clear all views
                        sails.models.view.destroy({}).exec(function (e) {
                            if (e) {
                                sails.log.error('Unable to clear view collection - ' + e);
                            } else {

                                // add views
                                sails.models.view.create(homeView).exec(function (e, results) {
                                    if (e) {
                                        sails.log.error('Unable to create home view - ' + e);
                                    }
                                });
                                sails.models.view.create(researchView).exec(function (e, results) {
                                    if (e) {
                                        sails.log.error('Unable to create research view - ' + e);
                                    }
                                });
                                sails.models.view.create(fortifiedView).exec(function (e, results) {
                                    if (e) {
                                        sails.log.error('Unable to create fortified view - ' + e);
                                    }
                                });
                                sails.models.view.create(commercialView).exec(function (e, results) {
                                    if (e) {
                                        sails.log.error('Unable to create commercial view - ' + e);
                                    }
                                });
                                sails.models.view.create(allView).exec(function (e, results) {
                                    if (e) {
                                        sails.log.error('Unable to create all view - ' + e);
                                    }
                                });

                                sails.models.view.create(generalView).exec(function (e, results) {
                                    if (e) {
                                        sails.log.error('Unable to create general view - ' + e);
                                    }
                                });

                                var cur = null;
                                // add each independent risk view
                                for (var cat in categories) {

                                    if (categories[cat].isRisk) {

                                        // build view
                                        cur = {
                                            name: categories[cat].name,
                                            showMenu: false,
                                            showSearch: false,
                                            defaultCategory: categories[cat].name,
                                            categories: [categories[cat]],
                                            active: true
                                        };

                                        // save
                                        sails.models.view.create(cur).exec(function (e, results) {
                                            if (e) {
                                                sails.log.error('Unable to create ' + cat.name + ' risk view - ' + e);
                                            }
                                        });

                                    }// if
                                }// for
                            }// if-else
                        });
                        
                        setTimeout(function () {
                            done();
                        }, 5000);


                    }// if

                } catch (e) {
                    sails.log.error('APIClient create exception - ' + e.message);
                    done(e);
                }// try-catch

            });
        }// if-else

    });

    grunt.registerTask('api-sync-foldercache', 'Syncs the folder cache from Egnyte.', function (env, syncOverride) {

        var done = this.async();

        if (arguments.length === 0) {
            grunt.log.writeln(this.name + ", no args");
            grunt.log.writeln('');
            grunt.log.writeln('Usage: grunt api-sync-foldercache:{environment}:{syncOverride}');

            done('Arguments required');
        } else {


            Sails.lift({
                port: 8181,
                log: {
                    level: 'info'
                },
                environment: env
            }, function (err, server) {
                sails = server;

                try {

                    if (err) {
                        grunt.log.error('*** ERROR - ' + err);
                        done();
                    } else {

                        grunt.log.writeln('>>>>> Checking for file updates');


                        // check if there's new updates
                        sails.services.syncfactory.updateCheck(function (hasUpdates) {

                            grunt.log.writeln('>>>>>> file has updates is ' + hasUpdates);

                            if (hasUpdates || syncOverride) {

                                grunt.log.writeln('>>>>>> Syncing folder cache from Egnyte');

                                // sync folders
                                sails.services.syncfactory.sync()
                                   .then(function (results) {
                                       sails.log.info('Sync completed - ' + JSON.stringify(results));
                                       done();

                                   }, function (e) {
                                       sails.log.error('Folder cache sync failed - ' + e);
                                       done(e);
                                   });
                            } else {
                                grunt.log.writeln('>>>>>> Nothing to sync');
                                done();
                            }// if-else
                        });


                    }// if

                } catch (e) {
                    sails.log.error('APIClient folder cache sync exception - ' + e.message);
                    done(e);
                }// try-catch

            });
        }// if-else

    });
};
