/*
    Name: salesforce.js
    Description: This module handles intermeidary methods to a SalesForce endpoint.

*/

var q = require('q');
var request = require('request');
var jsforce = require('jsforce');
var _sfConn = null;
var _batchSize = 10000;

var _parser = {

    parseUser: function (sfUser) {

        try {
        
            if (sfUser) {

                var user = {
                    id: sfUser.Id,
                    name: sfUser.Name,
                    username: sfUser.Web_Login_Name__c,
                    membershipLevel: sfUser.Contact_Membership_Level__c,
                    isRACMember: (sfUser.npsp__Primary_Affiliation__r 
                                    && sfUser.npsp__Primary_Affiliation__r.Current_RAC_Memberships__c > 0),
                    company: _parser.parseCompany(sfUser.npsp__Primary_Affiliation__r), // parse company obj
                    committees: [],
                    groups: []
                };


                // membership group
                if (user.membershipLevel) {
                    user.groups.push(user.membershipLevel);
                }// if

                // if RAC member set RAC group
                if (user.isRACMember) {
                    user.groups.push('RAC');
                }// if

                // set company group
                if (user.company) {
                    user.groups.push(user.company.name + ' - ' + user.company.id);
                }// if
                
                // set committees group
                if (sfUser.Committee_Memberships__r && sfUser.Committee_Memberships__r.records && sfUser.Committee_Memberships__r.records.length > 0) {

                    // parse committees
                    user.committees = _.map(sfUser.Committee_Memberships__r.records, function (c) {

                        // parse committee
                        var comm = _parser.parseCommittee(c);

                        // add committee group
                        user.groups.push(comm.name + ' - ' + comm.id);

                        // add committee role
                        if (comm.role) {
                            user.groups.push(cur.name + ' - ' + comm.role + ' - ' + comm.id);
                        }// if

                        return comm;
                    })

                } // if

                return user;
            } else {
                return null;

            }// if-else

        } catch (e) {
            sails.log.error('SalesForce._parser.parseUser() Exception - ' + e.message);
            throw e;
        }// try-catch
    },

    parseCompany: function (sfCompany) {

        try {

            if (sfCompany) {
                return {
                    id: sfCompany.Id,
                    name: sfCompany.Name,
                    inRAC: sfCompany.Current_RAC_Memberships__c > 0
                };
            } else {
                return null;
            }// if-else

        } catch (e) {
            sails.log.error('SalesForce._parser.parseCompany() Exception - ' + e.message);
            throw e;
        }// try-catch

    },

    parseCommittee: function (sfCommittee) {

        try {

            if (sfCommittee) {

                if (sfCommittee.Committee__r) {

                    // parse committee membership
                    return {
                        id: sfCommittee.Committee__r.Id,
                        name: sfCommittee.Committee__r.Name,
                        role: sfCommittee.role__c
                    };
                } else {

                    // parse committee
                    return {
                        id: sfCommittee.Id,
                        name: sfCommittee.Name
                    };
                }// if-else

            } else {
                return null;
            }// if-else

        } catch (e) {
            sails.log.error('SalesForce._parser.parseCommittee() Exception - ' + e.message);
            throw e;
        }// try-catch
    }

};


var _auth = {

    authenticateApp: function () {

        var promise = q.Promise(function (resolve, reject, inform) {

            if (_sfConn && _sfConn.accessToken) {

                sails.log.debug('SalesForce._auth.authenticateApp() Connection exists in cache');

                // return connnection in memory
                resolve(_sfConn);
            } else {

                sails.log.debug('SalesForce._auth.authenticateApp() Creating new connection to SalesForce with ' + sails.config.salesforce.username);

                // create new connection
                _sfConn = new jsforce.Connection();
                _sfConn.login(sails.config.salesforce.username, sails.config.salesforce.password + sails.config.salesforce.token,
                    function (err, userInfo) {

                        if (err) {
                            sails.log.error('SalesForce._auth.authenticateApp() ' + err);
                            reject(err);
                        } else {
                            sails.log.debug('SalesForce._auth.autehnticateApp() Caching connection');
                            resolve(_sfConn);
                        }// if-else

                    });
            }// if-else
        });

        return promise;

    },

    // Authenticates a user against salesforce
    authenticateUser: function (username, password) {

        sails.log.info('SalesForce._auth.authenticateUser() Authenticating user ' + username);

        return _data.getMembers(username, password)
                    .then(function (results) {

                        sails.log.info('SalesForce._auth.authenticateUser() User exists');

                        if (results && results.success && results.members && results.members.length > 0) {
                            return { success: true, user: results.members[0] };
                        } else {
                            return { success: false, user: null };
                        }// if-else

                    }, function (e) {

                        // propagate
                        throw e;
                    });
    }
};

var _data = {

    membershipLevels: ['Member', 'Full Member', 'Affiliate Member', 'Associate - Class IV', 'Associate Member - Class IV', 'Override'],

    // gets list of users from salesforce
    getMembers: function (username, password) {
        
        var promise = q.Promise(function (resolve, reject, inform) {

            _auth.authenticateApp().then(function (conn) {

                /*
                    SELECT id, name, web_login_name__c
                            , npsp__Primary_Affiliation__r.name, npsp__Primary_Affiliation__r.id
                            , (
                                select committee__r.id,name, committee__r.name
                                from Committee_Memberships__r
                            )
                    from Contact
                    where Contact_Membership_Level__c in ('Full Member', 'Affiliate Member', 'Associate Member - Class IV', 'Override')
                    and username = [username] // optional
                    and password = [password] // optional
                */

                var membership = JSON.stringify(_data.membershipLevels).replace(/\[/g, '(').replace(/\]/g, ')').replace(/"/g, "'");

                // get userinfo and authenticate credentials
                conn.sobject("Contact")

                    // root fields
                  .select('id,name,web_login_name__c,web_login_password__c,npsp__Primary_Affiliation__r.name,Contact_Membership_Level__c,'
                            + 'npsp__Primary_Affiliation__r.id,npsp__Primary_Affiliation__r.Current_RAC_Memberships__c')

                    // sub query
                  .include("Committee_Memberships__r")
                    .select("committee__r.id,committee__r.name,role__c").end()

                    // where
                  .where("Contact_Membership_Level__c in " + membership
                        + (username && username != '' ? " and web_login_name__c='" + username + "'" : '')
                        + (password && password != '' ? " and web_login_password__c='" + password + "'" : ''))
                  .execute({ autoFetch: true, maxFetch: _batchSize },
                      function (err, records) {

                          try {
                              if (err) {
                                  sails.log.error('SalesForce._data.getMembers() Login exception - ' + err);
                                  reject(err);

                              } else if (records && records.length > 0) {

                                  var members = _.map(records, function (u) {
                                      return _parser.parseUser(u);
                                  });

                              
                                  // build user object
                                  resolve({ success: true, members: members });

                              } else {
                                  resolve( { success: false, members: null });
                              }// if-else
                          } catch (e) {
                              reject(e);
                          }// try-catch

                      });


            }, function (e) {

                // propagate
                reject(e);
            });

        });

        return promise;

    },

    // log a user action to salesforce
    logAction: function (action, username, resource) {

        var promise = q.Promise(function (resolve, reject, inform) {

            _auth.authenticateApp().then(function (conn) {

                // add new record to activity log
                conn.sobject("ActivityLog__c")
                    .create({
                        Action__c: action,
                        User__c: username,
                        Resource__c: resource,
                        Log_Date__c: new Date()
                    }, function (err, ret) {

                        // return success or error
                        if (err) {
                            sails.log.error('SalesForce._data.logAction() Errored - ' + err);
                            reject(err);
                        } else {
                            resolve({ success: ret.success });
                        }// if-else

                    });
            }, function (e) {

                // propagate
                reject(e);
            });
        });

        return promise;
    },

    // gets all companies with valid membership levels
    getCompanies: function () {

        var promise = q.Promise(function (resolve, reject, inform) {

            _auth.authenticateApp().then(function (conn) {

                conn.sobject("Account")
                  .find(
                    // where
                    {
                        Membership_Level__c: { $in: _data.membershipLevels }
                    },
                    // select
                    {
                        id: 1,
                        name: 1,
                        Membership_Level__c: 1,
                        Current_RAC_Memberships__c: 1
                    }
                  ).execute({ autoFetch: true, maxFetch: _batchSize },
                      function (err, records) {

                          if (err) {
                              sails.log.error('SailesForce._data.getCompanies() Exception - ' + err);
                              reject(err);
                          } else {

                              sails.log.info('SailsForce._data.getCompanies() Received ' + records.length + ' records');

                              var companies = [];
                              if (records && records.length > 0) {
                                  // parse companies
                                  companies = _.map(records, function (c) {
                                      return _parser.parseCompany(c);
                                  });
                              } // if

                              resolve({ success: true, companies: companies });

                          }// if-else

                      });

            }, function (e) {

                // propagate
                reject(e);
            });

        });

        return promise;

    },

    getCommittees: function () {

        var promise = q.Promise(function (resolve, reject, inform) {

            _auth.authenticateApp().then(function (conn) {

                conn.sobject("Committee__c")
                  .find(
                    // where
                    {},
                    // select
                    {
                        id: 1,
                        name: 1
                    }
                  ).execute({ autoFetch: true, maxFetch: _batchSize },
                    function (err, records) {


                        if (err) {
                            sails.log.error('SailesForce._data.getCommittees() Exception - ' + err);
                            reject(err);
                        } else {

                            sails.log.info('SailsForce._data.getCommittees() Received ' + records.length + ' records');

                            var comm = [];
                            if (records && records.length > 0) {
                                // parse companies
                                comm = _.map(records, function (c) {
                                    return _parser.parseCommittee(c);
                                });
                            } // if

                            resolve({ success: true, committees: comm });

                        }// if-else

                    });

            }, function (e) {

                // propagate
                reject(e);
            });

        });

        return promise;
    }
};

module.exports = {

    authenticateUser: _auth.authenticateUser,
    getUsers: _data.getMembers,
    logAction: _data.logAction,
    getCompanies: _data.getCompanies,
    getCommittees: _data.getCommittees

};