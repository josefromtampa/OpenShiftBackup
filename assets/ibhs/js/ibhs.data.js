ibhs = window.ibhs || {};

// data namespace
ibhs.data = (function ($) {

    /* private */
    var _mode = 'prod';
    var _host = (_mode == 'prod' ? window.location.protocol + '//memberportal-ibhs.rhcloud.com/' : (_mode == 'test' ? window.location.protocol + '//test-ibhs.rhcloud.com/' : window.location.origin + '/'));
    var _session = null;
    var k = 'o&!JPK^pA7ZR@7ZCqfm2FFmQC';

    /* helpers */
    var _controller = {

        initialize: function(callback){

            // get session
            if (_session == null) {
                    
                // get user
                _session.session = ibhs.common.getSession();

                // get token
                _session.token = ibhs.common.getSession();

            }// if

            return _session;


        }
    };

    var _datastore = {

        isCORS: function(){
            return window.location.toString().indexOf(_host) == -1;
        },

        download: function (path, callback) {

            try {

                if (path.indexOf('/', 0)) {
                    path = path.slice(1);
                }// if

                // check session
                ibhs.common.validateSession(function (session) {

                    if (session.valid) {

                        $.ajax({
                            type: 'GET',
                            url: _host + 'filestore/download/' + session.token + '/' + path,
                            success: function (results) {

                                callback(results);
                                //if (results.success) {

                                //    // trigger download
                                //    ibhs.common.browserDownload(results.data);

                                //    ibhs.common.handleResponse(true, null, caallback, 'Download success');

                                //} else {
                                //    console.warn('File retrieval failed');
                                //    ibhs.common.handleResponse(false, null, callback, 'No data');
                                //}// if-else
                            },
                            error: function (xhr, status, e) {
                                if (xhr.status == 403) {
                                    console.warn(xhr.responseText);
                                    ibhs.common.handleResponse(false, null, callback, xhr.responseText);
                                } else {
                                    throw e;
                                }// if-else
                            }
                        });

                    } else {
                        ibhs.common.handleResponse(false, null, callback, 'Session is invalid');
                    }// if-else

                });
            } catch (e) {
                ibhs.common.handleError(e, callback);

            }// try-catch

        },

        getView: function(viewName, callback){

            try {

                // validate current session
                ibhs.common.validateSession(function (session) {

                    if (session.valid) {
                        
                        $.ajax({
                            type: 'GET',
                            url: _host + 'ui/view/' + viewName + '/' + session.token,
                            cache: false,
                            dataType: (_datastore.isCORS() ? 'jsonp' : 'json'),
                            crossDomain: _datastore.isCORS(),
                            success: function (results) {

                                if (results.success) {
                                    ibhs.common.handleResponse(true, results.data, callback);
                                } else {
                                    ibhs.common.handleResponse(false, null, callback, 'No view data');
                                }// if-else
                            },
                            error: function (xhr, status, e) {
                                if (xhr.status == 403) {
                                    //console.warn(xhr.responseText);
                                    ibhs.common.handleResponse(false, null, callback, 'xhr.responseText');
                                } else {
                                    throw e;
                                }// if-else
                            }
                        });

                    } else {
                        ibhs.common.handleResponse(false, null, callback, 'Session is invalid');
                    }// if
                });

            } catch (e) {
                ibhs.common.handleError(e, callback);
                

            }// try-catch

        },

        getFile: function (fileid, callback) {
            try {

                // validate current session
                ibhs.common.validateSession(function (session) {

                    if (session.valid) {

                        $.ajax({
                            type: 'GET',
                            url: _host + 'filestore/' + fileid + '/' + session.token,
                            dataType: (_datastore.isCORS() ? 'jsonp' : 'json'),
                            crossDomain: _datastore.isCORS(),
                            success: function (results) {

                                if (results.success) {
                                    ibhs.common.handleResponse(true, results.data, callback);
                                } else {
                                    ibhs.common.handleResponse(false, null, callback, 'No view data');
                                }// if-else
                            },
                            error: function (xhr, status, e) {
                                if (xhr.status == 403) {
                                    //console.warn(xhr.responseText);
                                    ibhs.common.handleResponse(false, null, callback, 'xhr.responseText');
                                } else {
                                    throw e;
                                }// if-else
                            }
                        });

                    } else {
                        ibhs.common.handleResponse(false, null, callback, 'Session is invalid');
                    }// if
                });

            } catch (e) {
                ibhs.common.handleError(e, callback);
                
            }// try-catch

        },

        getFolders: function (callback) {
            try {

                // validate current session
                ibhs.common.validateSession(function (session) {

                    if (session.valid) {

                        $.ajax({
                            type: 'GET',
                            url: _host + 'filestore/folders/' + session.token,
                            cache: false,
                            dataType: (_datastore.isCORS() ? 'jsonp' : 'json'),
                            crossDomain: _datastore.isCORS(),
                            success: function (results) {

                                if (results.success) {
                                    ibhs.common.handleResponse(true, results.data, callback);
                                } else {
                                    ibhs.common.handleResponse(false, null, callback, 'No folder data');
                                }// if-else
                            },
                            error: function (xhr, status, e) {
                                if (xhr.status == 403) {
                                    //console.warn(xhr.responseText);
                                    ibhs.common.handleResponse(false, null, callback, 'xhr.responseText');
                                } else {
                                    throw e;
                                }// if-else
                            }
                        });

                    } else {
                        ibhs.common.handleResponse(false, null, callback, 'Session is invalid');
                    }// if
                });

            } catch (e) {
                ibhs.common.handleError(e, callback);

            }// try-catch
        }

    };

    var _user = {

        login: function (username, password, callback) {

            
            try {


                $.ajax({
                    type: 'POST',
                    url: _host + 'portal',
                    cache: false,
                    beforeSend: function (request) {
                        request.setRequestHeader("api-key", k);
                    },
                    data: {
                        username: username,
                        password: password
                    },
                    success: function (results) {

                        if (results.success) {
                            ibhs.common.handleResponse(true, {
                                access_token: results.access_token,
                                user: results.user
                            }, callback);
                        } else {
                            ibhs.common.handleResponse(false, null, callback, 'Login failed');
                        }// if-else
                    },
                    error: function (xhr, status, e) {
                        if (xhr.status == 403) {
                            ibhs.common.handleResponse(false, null, callback, 'Login failed');
                        } else {
                            ibhs.common.handleResponse(false, null, callback, 'Login Error');
                        }// if-else
                    }
                });



            } catch (e) {
                ibhs.common.handleError(e, callback);

            }// try-catch
        },

        logout: function (callback) {
            
            try {

                // validate current session
                var token = ibhs.common.getToken();
                
                if (token){
                    $.ajax({
                        type: 'GET',
                        url: _host + 'user/logout/' + token,
                        cache: false,
                        dataType: (_datastore.isCORS() ? 'jsonp' : 'json'),
                        crossDomain: _datastore.isCORS(),
                        success: function (results) {

                            if (results.success) {
                                ibhs.common.handleResponse(true, null, callback, 'User logged out');
                            } else {
                                ibhs.common.handleResponse(false, null, callback, 'No view data');
                            }// if-else
                        },
                        error: function (xhr, status, e) {
                            if (xhr.status == 403) {
                                //console.warn(xhr.responseText);
                                ibhs.common.handleResponse(false, null, callback, 'xhr.responseText');
                            } else {
                                throw e;
                            }// if-else
                        }
                    });
                } else {
                    ibhs.common.handleResponse(true, null, callback, 'User logged out');
                }// if-else


            } catch (e) {
                ibhs.common.handleError(e, callback);

            }// try-catch

        }

    };


    /* public */
    return {
        getHost: function(){
            return _host;
        },
        downloadFile: _datastore.download,
        getView: _datastore.getView,
        getFolders: _datastore.getFolders,
        getFile: _datastore.getFile,

        user: {
            login: _user.login,
            logout: _user.logout
        }

    };



})(jQuery);
