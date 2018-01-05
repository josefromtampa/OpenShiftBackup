
var q = require('q');
var async = require('async');


var _dataController = {
    
    buildFile: function(category, file){

        try {

            // parse filename for attributes
            var attr = CommonFactory.parseFileAttributes(file.name);
            var newFile = null;
            
            if (attr) {
                
                // build file object if attributes were parsed
                newFile = {
                    category: category.toLowerCase(),
                    group: attr.group,
                    date: (file.last_modified ? new Date(file.last_modified) : null),
                    path: file.path,
                    type: attr.ext,
                    tags: attr.tags,
                    name: attr.name + '.' + attr.ext
                };
            }// if

            return newFile;


        } catch (e) {

            sails.log.error('FileCacheFactory._dataController.buildFile() Exception - ' + e.message);
            return null;
        }// try-catch



    },

    flattenFiles: function (defaultCategory, folderList) {

        try {

            var cur = null;
            var groupObj = {};

            // iterate through results - results is a list of FolderCache
            _.forEach(folderList, function (folderCache) {
                    
                // iterate through each file in folder - FolderCache contains a list of files in value filed
                _.forEach(folderCache.value, function (file) {

                    // only parse files
                    if (file && !file.is_folder) {

                        // build new file object
                        cur = _dataController.buildFile(folderCache.category, file);


                        if (cur) {
                            // add file to group structure
                            if (groupObj[cur.group]) {

                                // add to array if existing group
                                groupObj[cur.group].push(cur);

                            } else {
                                // initialize array
                                groupObj[cur.group] = [cur];

                            }// if
                        }// if


                    }// if
                });
                    
            });

            // parse into group structure
            var groupList = [];           
            for (var group in groupObj) {
                groupList.push({
                    id: group.replace(/\s/ig, '_'),
                    title: group,
                    files: groupObj[group].sort(function (a, b) { return (a.name > b.name) ? 1 : (a.name < b.name) ? -1 : 0; })
                });
            }// for

            // sort group by title
            groupList.sort(function (a, b) { return (a.title > b.title) ? 1 : (a.title < b.title) ? -1 : 0; });
            
            return groupList;

        } catch (e) {
            sails.log.error('FileCacheFactory._dataController.flattenFiles() Exception - ' + e.message);
            return null;
        }// try-catch  
    }

};

var _queryBuilder = {

    buildCategoryQuery: function(categories){

        // build category query
        var cats = [];
        for (var i = 0; i < categories.length; i++) {
            cats.push(categories[i].name.toLowerCase());
        }// for

        return { $in: cats };

    },

    buildPublicQuery: function(categoryQuery){

        return { type: FolderCache.folderTypes.public, category: categoryQuery };
    },

    buildMembersQuery: function(categoryQuery){

        return { type: FolderCache.folderTypes.member, category: categoryQuery };
    },

    buildCompanyQuery: function (company) {

        if (company) {
            return { type: FolderCache.folderTypes.company, owner: company.name.toLowerCase() };
        }// if

        return null;
    },

    buildCommitteeQuery: function(committees){

        var queries = null;

        if (committees) {
            queries = {};

            // iterate and build query
            _.forEach(user.committees, function (committee) {

                queries.push({
                    type: FolderCache.folderTypes.committee,
                    category: 'committee',
                    owner: committee.name.toLowerCase()
                });

                // add role criteria if role exists
                if (committee.role) {
                    queries.push({
                        type: FolderCache.folderTypes.committee,
                        category: committee.role.toLowerCase(),
                        owner: committee.name
                    });
                }// if

            });
        }// if

        return queries;
    }
};



module.exports = {

    get: function (view, user) {

        var promise = q.Promise(function (resolve, reject, inform) {

            if (view && user) {

                // build category query
                var catquery = _queryBuilder.buildCategoryQuery(view.categories);

                // build public, member, and company queries
                var queries = [_queryBuilder.buildPublicQuery(catquery),
                                _queryBuilder.buildMembersQuery(catquery)];

                var companyQuery = _queryBuilder.buildCompanyQuery(user.company);
                if (companyQuery) {
                    queries.push(companyQuery);
                }// if

                // build community query
                var committeeQueries = _queryBuilder.buildCommitteeQuery(user.committee);
                if (committeeQueries) {
                    queries.concat(commiteeQueries);
                }// if

                // execute
                FolderCache.find({ $or: queries }).exec(function (e, results) {

                    if (e) {
                        sails.log.error('FileCacheFactory.get() find exception - ' + e);
                        reject(e);
                    } else {

                        if (results && results.length > 0) {
                            // flatten
                            var data = _dataController.flattenFiles(view.defaultCategory, results);

                            resolve({ success: true, data: data });
                        } else {
                            resolve({ success: false, data: null });
                        }// if-else

                    }// if-else

                });
            } else {
                reject('No view or user specified');
            }// if-else
        });

        return promise;

    },

    getFile: function (entryid) {

        var promise = q.Promise(function (resolve, reject, inform) {

            try {

                var query = { value: { $elemMatch: { entry_id: entryid } } };

                FolderCache.findOne(query).exec(function (e, doc) {
                    if (e) {
                        sails.log.error('FileCacheFactory.getFile() find exception - ' + e);
                        reject(e);
                    } else {

                        if (doc && doc.value && doc.value.length > 0) {

                            for (var i = doc.value.length; i--;) {
                                if (doc.value[i].entry_id == entryid) {
                                    resolve(doc.value[i]);
                                    break;
                                }// if
                            }// for

                            resolve(null);

                        } else {
                            sails.log.warn('FileCacheFactory.getFile() Document was found but entryId ' + entryid + ' was not in file list');
                            resolve(null);
                        }// if-else

                    }// if
                });

            } catch (e) {
                sails.log.error('FileCacheFactory.getFile() Exception - ' + e.message);
                reject('FileCacheFactory.getFile() Exception - ' + e.message);
            }// try-catch

        });

        return promise;


    },

    getFolders: function () {

        var promise = q.Promise(function (resolve, reject, inform) {

            // execute
            FolderCache.find().exec(function (e, results) {

                if (e) {
                    sails.log.error('FileCacheFactory.getFolders() find exception - ' + e);
                    reject(e);
                } else {

                    resolve(results);

                }// if-else

            });
        });

        return promise;
    }
};