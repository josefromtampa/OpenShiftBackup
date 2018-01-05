

var Sails = require('sails'),
    sails,
    async = require('async');


module.exports = function (grunt) {

    grunt.registerTask('set_egnytecompanies', 'Setup companies folder on Egnyte.', function (arg1, arg2) {
        if (arguments.length === 0) {
            grunt.log.writeln(this.name + ", no args");
        } else {
            grunt.log.writeln(this.name + ", " + arg1 + " " + arg2);
        }
        var done = this.async();

        Sails.lift({
            // configuration for testing purposes
            log: {
                level: 'debug'
            }
        }, function (err, server) {
            sails = server;
         
            if (err) {
                grunt.log.error('*** ERROR - ' + err);
                done();
            } else {

                grunt.log.writeln('>>>>>> Starting Egnyte companies setup');

              
                sails.services.salesforce.getCompanies()
                   .then(function (results) {

                       grunt.log.writeln('>>>>> getCompanies() got ' + results.companies.length + ' companies');

                       if (results.success && results.companies.length > 0) {
                           grunt.log.writeln('>>>>>> Got companies from SalesForce');


                           async.eachSeries(results.companies,
                                function (c, callback) {

                                    setTimeout(function () {
                                        var folder = 'private/companies/' + c.name.replace('/', '_');

                                        sails.services.filestorefactory.folder.create(folder)
                                            .then(function (results) {

                                                grunt.log.writeln('>>>>>> Created Egnyte folder ' + folder + ' ' + JSON.stringify(results));
                                                callback();

                                            }, function (e) {
                                                grunt.log.error('>>>>>> Egnyte folder create failed ' + e);
                                                callback();
                                            });
                                    }, 500);


                                }, function (error) {

                                    if (error) {
                                        grunt.log.error('>>>>>> ' + error);
                                    } else {
                                        grunt.log.writeln('>>>>>> DONE');

                                    }// if-else

                                    done();
                                });
                           


                       } else {
                           grunt.log.writeln('>>>>>> Retrieve SalesForce company list failed');

                           done();
                       }// if-else


                   }, function (e) {
                       grunt.log.error('>>>>>> SalesForce get company list failed ' + e);
                       done();
                   });


            }// if

        });

    });


    grunt.registerTask('set_egnytecommittees', 'Setup committees folder on Egnyte.', function (arg1, arg2) {
        if (arguments.length === 0) {
            grunt.log.writeln(this.name + ", no args");
        } else {
            grunt.log.writeln(this.name + ", " + arg1 + " " + arg2);
        }
        var done = this.async();

        Sails.lift({
            // configuration for testing purposes
            log: {
                level: 'debug'
            }
        }, function (err, server) {
            sails = server;

            if (err) {
                grunt.log.error('*** ERROR - ' + err);
                done();
            } else {

                grunt.log.writeln('>>>>>> Starting Egnyte committees setup');


                sails.services.salesforce.getCommittees()
                   .then(function (results) {

                       grunt.log.writeln('>>>>> getCommittees() got ' + results.committees.length + ' committees');

                       if (results.success && results.committees.length > 0) {
                           grunt.log.writeln('>>>>>> Got committees from SalesForce');


                           async.eachSeries(results.committees,
                                function (c, callback) {

                                    setTimeout(function () {
                                        var folder = 'private/committees/' + c.name.replace('/', '_');

                                        sails.services.filestorefactory.folder.create(folder)
                                            .then(function (results) {

                                                grunt.log.writeln('>>>>>> Created Egnyte folder ' + folder + ' ' + JSON.stringify(results));
                                                callback();

                                            }, function (e) {
                                                grunt.log.error('>>>>>> Egnyte folder create failed ' + e);
                                                callback();
                                            });

                                    }, 1000);

                                }, function (error) {

                                    if (error) {
                                        sails.log.warn('>>>>>> ' + error);
                                    } else {
                                        grunt.log.writeln('>>>>>> DONE');

                                    }// if-else

                                    done();
                                });



                       } else {
                           grunt.log.writeln('>>>>>> Retrieve SalesForce committee list failed');

                           done();
                       }// if-else


                   }, function (e) {
                       grunt.log.error('>>>>>> SalesForce get committee list failed ' + e);
                       done();
                   });


            }// if

        });

    });
};