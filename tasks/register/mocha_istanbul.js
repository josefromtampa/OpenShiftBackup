
module.exports = function (grunt) {

    grunt.registerTask('test-list', 'Shows the list of supported test commands.', function () {

        grunt.log.writeln(' ');
        grunt.log.writeln('Supported Tests');
        grunt.log.writeln('***************************************************************');
        grunt.log.writeln('test          ==> Runs through all tests');
        grunt.log.writeln('test-models   ==> Runs through tests for MODELS');
        grunt.log.writeln('test-services ==> Runs through tests for SERVICES');
        grunt.log.writeln('test-cache    ==> Runs through tests for CACHE functionality');
        grunt.log.writeln('test-sync     ==> Runs through tests for SYNC functionality');
    });

    grunt.registerTask('test', [
        'mocha_istanbul:test'
    ]);
    grunt.registerTask('test-models', [
        'mocha_istanbul:test-models'
    ]);
    grunt.registerTask('test-services', [
        'mocha_istanbul:test-services'
    ]);
    grunt.registerTask('test-sync', [
        'mocha_istanbul:test-sync'
    ]);
    grunt.registerTask('test-cache', [
        'mocha_istanbul:test-cache'
    ]);
    grunt.registerTask('test-controllers', [
      'mocha_istanbul:test-controllers'
    ]);
};
