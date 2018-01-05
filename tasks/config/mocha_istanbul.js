


module.exports = function(grunt) {

    grunt.config.set('mocha_istanbul', {
        test: {
            src: 'test', // the folder, not the files
            options: {
                coverageFolder: 'coverage',
                mask: '**/*.test.js',
                root: 'api/'
            }
        },

        'test-services': {
            src: 'test/services', // the folder, not the files
            options: {
                coverageFolder: 'coverage',
                mask: '**/*.js',
                root: 'api/'
            }
        },
        'test-sync': {
            src: 'test/sync', // the folder, not the files
            options: {
                coverageFolder: 'coverage',
                mask: '**/*.js',
                root: 'api/'
            }
        },
        'test-models': {
            src: 'test/models', // the folder, not the files
            options: {
                coverageFolder: 'coverage',
                mask: '**/*.js',
                root: 'api/'
            }
        },

        'test-cache': {
            src: 'test/cache', // the folder, not the files
            options: {
                coverageFolder: 'coverage',
                mask: '**/*.js',
                root: 'api/'
            }
        },

        'test-controllers': {
          src: 'test/controllers', // the folder, not the files
          options: {
            coverageFolder: 'coverage',
            mask: '**/*.js',
            root: 'api/'
          }
        }

    });

    grunt.loadNpmTasks('grunt-mocha-istanbul');
};
