

'use strict';

var assert = require('assert');
var Sails = require('sails');

describe('Cache Factory Service', function () {


    this.timeout(6000);

    var cache = null;

    describe('KeyCache', function () {


        it('should clear cache', function (done) {

            sails.models.cache.destroy()
                    .exec(function cb(e, doc) {
                        assert(true, 'UNITTEST: Cache successfully cleared');
                        done();
                    });

        });

        it('should cache batman', function (done) {


            var obj = {
                firstname: 'Bruce',
                lastname: 'Wayne',
                address: 'Bat cave',
                car: 'Bat mobile',
                enemies: ['Joker', 'Two Face']
            };

            sails.models.cache.create({ key: 'batman', value: obj })
                .exec(function cb(e, doc) {

                    sails.log.info('UNITTEST: Cache saved for batman - ' + JSON.stringify(doc));

                    if (e) {
                        throw ('Set cache failed - ' + e);
                    } else {
                        assert(true, 'Object cached successfully');
                        done();
                    }// if-else

                });


        });

        it('should cache superman', function (done) {


            var obj = {
                firstname: 'Clark',
                lastname: 'Kent',
                address: 'Krypton',
                power: 'super-human',
                enemies: ['Lex Luther', 'Aliens']
            };

            sails.models.cache.upsert('superman', obj,
                function (e) {

                    sails.log.info('UNITTEST: Cache saved for superman');

                    if (e) {
                        throw ('Set cache failed - ' + e);
                    } else {
                        assert(true, 'Object cached successfully');
                        done();
                    }// if-else

                });


        });

        it('should cache spiderman', function (done) {

            var obj = {
                firstname: 'Peter',
                lastname: 'Parker',
                address: 'City',
                power: 'spider senses',
                enemies: ['Sandman', 'Dr. Octo', 'Venom']
            };

            sails.models.cache.create({ key: 'spiderman', value: obj })
                .exec(function created(e, doc) {

                    sails.log.info('UNITTEST: Cache saved for spiderman - ' + JSON.stringify(doc));

                    if (e) {
                        throw ('Set cache failed - ' + e);
                    } else {
                        assert(true, 'Object cached successfully');
                        done();
                    }// if-else

                });


        });

        it('should update spiderman', function (done) {

            var obj = {
                firstname: 'PETER',
                lastname: 'PARKER',
                address: 'City',
                power: 'spider senses',
                enemies: ['Sandman', 'Dr. Octo', 'Venom']
            };

            sails.models.cache.upsert('spiderman', obj,
                function (e, doc) {

                    sails.log.info('UNITTEST: Cache updated for spiderman');

                    if (e) {
                        throw ('Set cache failed - ' + e);
                    } else {
                        assert(true, 'Cache upserted successfully');
                        done();
                    }// if-else

                });

        });

        it('should select batman', function (done) {

            sails.models.cache.findOne({ key: 'batman' })
                .exec(function cb(e, doc) {


                    if (e) {
                        throw ('Retrieve cache failed - ' + e);

                    } else {

                        sails.log.info('UNITTEST: Cache found key - ' + JSON.stringify(doc));
                        assert(true, 'Object retrieved');

                        done();
                    }// if-else

                });



        });

        it('should delete batman', function (done) {

            sails.models.cache.destroy({ key: 'batman' })
                .exec(function cb(e) {

                    if (e) {
                        throw ('Cache delete failed - ' + e);
                    } else {
                        sails.log.info('UNITTEST: Cache record deleted');
                        assert(true, 'Batman successfully deleted');
                        done();

                    }// if-else

                });



        });

        it('should search all "S" heroes', function (done) {

            sails.models.cache.find({ key: /^s/ })
                .exec(function cb(e, results) {

                    if (e) {
                        console.log(e);
                        throw ('Cache search failed - ' + e);
                    } else {
                        sails.log.info('UNITTEST: CacheFactory search() for "S" heroes - ' + JSON.stringify(results));
                        assert(true, 'Cache records retrieved');
                        done();
                    }// if-else
                });



        });


    });

    describe('FolderCache', function () {


        it('should clear cache', function (done) {

            sails.models.foldercache.destroy({ version: 'test' })
                .exec(function cb(e, results) {

                    if (e) {
                        throw ('Folder cache clear failed - ' + e);
                    } else {
                        assert(true, 'UNITTEST: Folder Cache successfully cleared');
                        done();
                    }// if-else
                });
        });

        it('should cache Public', function (done) {

            try {
                var structure = {
                    folder: ['folder1', 'folder2', 'folder3'],
                    files: [
                        { name: 'file.txt' },
                        { name: 'file.txt' },
                        { name: 'file.txt' }]

                };

                var type = sails.models.foldercache.folderTypes.public,
                    category = 'Fortified',
                    name = '';

                sails.models.foldercache.create({ type: type, owner: '', category: category, name: name, value: structure, version: 'test' })
                    .exec(function cb(e, results) {

                        if (e) {
                            throw ('Set folder cache failed - ' + e);
                        } else {
                            sails.log.info('UNITTEST: Cache folder created for public - ' + JSON.stringify(results));
                            assert(true, 'Folder cached successfully');

                            done();
                        }// if-else

                    });

            } catch (e) {
                console.log(e.message);
                assert(false, e.message);
                done();
            }// try-catch
        });

        it('should cache Public 2', function (done) {

            var structure = {
                folder: ['folder1', 'folder2', 'folder3'],
                files: [
                    { name: 'file.txt' },
                    { name: 'file.txt' },
                    { name: 'file.txt' }]

            };

            var type = sails.models.foldercache.folderTypes.public,
                category = 'Hurricane',
                name = '';

            sails.models.foldercache.create({ type: type, owner: '', category: category, name: name, value: structure, version: 'test' })
                .exec(function cb(e, results) {

                    if (e) {
                        throw ('Set folder cache failed - ' + e);
                    } else {
                        sails.log.info('UNITTEST: Cache folder created for public 2 - ' + JSON.stringify(results));
                        assert(true, 'Folder cached successfully');

                        done();
                    }// if-else

                });



        });

        it('should cache private member', function (done) {


            var structure = {
                folder: ['folder1', 'folder2', 'folder3'],
                files: [
                    { name: 'file.txt' },
                    { name: 'file.txt' },
                    { name: 'file.txt' }]

            };

            var type = sails.models.foldercache.folderTypes.member,
                category = 'Fortified',
                name = '';

            sails.models.foldercache.create({ type: type, owner: '', category: category, name: name, value: structure, version: 'test' })
                .exec(function cb(e, results) {

                    if (e) {
                        throw ('Set folder cache failed - ' + e);
                    } else {
                        sails.log.info('UNITTEST: Cache folder created for private member - ' + JSON.stringify(results));
                        assert(true, 'Folder cached successfully');

                        done();
                    }// if-else

                });


        });

        it('should cache private company', function (done) {

            var structure = {
                folder: ['folder1', 'folder2', 'folder3'],
                files: [
                    { name: 'file.txt' },
                    { name: 'file.txt' },
                    { name: 'file.txt' }]

            };

            var type = sails.models.foldercache.folderTypes.company,
                category = 'Fortified',
                name = '';

            sails.models.foldercache.create({ type: type, owner: 'company1', category: category, name: name, value: structure, version: 'test' })
                .exec(function cb(e, results) {

                    if (e) {
                        console.log(e);
                        throw ('Set folder cache failed - ' + e);
                    } else {
                        sails.log.info('UNITTEST: Cache folder created for private company - ' + JSON.stringify(results));
                        assert(true, 'Folder cached successfully');

                        done();
                    }// if-else

                });


        });

        it('should cache private company2', function (done) {

            var structure = {
                folder: ['folder1', 'folder2', 'folder3'],
                files: [
                    { name: 'file.txt' },
                    { name: 'file.txt' },
                    { name: 'file.txt' }]

            };

            var type = sails.models.foldercache.folderTypes.company,
                category = 'Fortified',
                name = 'Company2';

            sails.models.foldercache.upsert(type, 'Company 2', category, name, structure, 'test',
                function cb(e) {

                    if (e) {
                        throw ('Set folder cache failed - ' + e);
                    } else {
                        sails.log.info('UNITTEST: Cache folder created for private company2');
                        assert(true, 'Folder cached successfully');

                        done();
                    }// if-else

                });


        });

        it('should cache another private company2', function (done) {

            var structure = {
                folder: ['folder1', 'folder2', 'folder3'],
                files: [
                    { name: 'file.txt' },
                    { name: 'file.txt' },
                    { name: 'file.txt' }]

            };

            var type = sails.models.foldercache.folderTypes.company,
                category = 'Hurricane',
                name = 'Company2';

            sails.models.foldercache.create({ type: type, owner: 'Company 2', category: category, name: name, value: structure, version: 'test' })
                .exec(function cb(e, results) {

                    if (e) {
                        throw ('Set folder cache failed - ' + e);
                    } else {
                        sails.log.info('UNITTEST: Cache folder created for private company2 again - ' + JSON.stringify(results));
                        assert(true, 'Folder cached successfully');

                        done();
                    }// if-else

                });


        });

        it('should select company1', function (done) {

            var type = sails.models.foldercache.folderTypes.company,
                name = 'Company1',
                category = 'Fortified';

            sails.models.foldercache.find({ owner: name })
                .exec(function cb(e, results) {

                    if (e) {
                        throw ('Folder retrieve cache failed - ' + e);
                    } else {
                        sails.log.info('UNITTEST: CacheFactory folder find - ' + JSON.stringify(results));
                        assert(true, 'Object successfully retrieved');
                        done();
                    }// if-else

                });



        });



        it('should delete company', function (done) {

            var type = sails.models.foldercache.folderTypes.company,
                name = 'Company1',
                category = 'Fortified';

            sails.models.foldercache.destroy({ type: type, owner: name, category: category })
                .exec(function cb(e) {

                    if (e) {
                        throw ('Select after delete failed - ' + e);
                    } else {
                        sails.log.info('UNITTEST: folder cahce destroyed records');
                        assert(true, 'Company folder successfully deleted');
                        done();
                    }// if-else
                });



        });



        it('should search all public folders', function (done) {

            var criteria = {
                $or: [
                    {
                        type: sails.models.foldercache.folderTypes.public,
                        category: 'Fortified'
                    },
                    {
                        type: sails.models.foldercache.folderTypes.member,
                        category: 'Fortified'
                    },
                    {
                        type: sails.models.foldercache.folderTypes.company,
                        owner: 'Company 2',
                        category: 'Fortified'
                    }
                ]

            };

            sails.models.foldercache.find(criteria)
                .exec(function cb(e, results) {

                    if (e) {
                        throw ('Folder cache search failed - ' + e);
                    } else {
                        sails.log.info('UNITTEST: Folder cache retrieved folders');
                        assert(true, 'Folders retrieved');
                        done();
                    }// if-else
                });

        });

        it('should clean up test cache', function (done) {

            sails.models.foldercache.destroy({ version: 'test' })
                .exec(function cb(e, results) {

                    if (e) {
                        throw ('Folder cache clear failed - ' + e);
                    } else {
                        assert(true, 'UNITTEST: Folder Cache successfully cleared');
                        done();
                    }// if-else
                });
        });


        it('should insert test cache', function (done) {

            sails.models.cache.upsert('test', { name: 'Bob', username: 'billy' }, 
                function(e) {

                    if (e) {
                        throw ('Cache upsert failed - ' + e);
                    } else {
                        assert(true, 'UNITTEST: Cache successfully upserted');
                        done();
                    }// if-else
                });
        });


        it('should get test cache', function (done) {

            sails.models.cache.findOne({ key: 'test' })
                .exec(function cb(e, doc) {

                    if (e) {
                        throw ('Cache select failed - ' + e);
                    } else {
                        assert(true, 'UNITTEST: Cache successfully retrieved');

                        done(null, doc);
                    }// if-else
                });
        });


        it('should clear test cache', function (done) {

            sails.models.cache.destroy({ key: 'test'})
                .exec(function cb(e) {

                    if (e) {
                        throw ('Cache clear failed - ' + e);
                    } else {
                        assert(true, 'UNITTEST: Cache successfully cleared');
                        done();
                    }// if-else
                });
        });



    });


});

