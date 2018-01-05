
ibhs = window.ibhs || {};
ibhs.widgets = ibhs.widgets || {};

ibhs.widgets.link = (function (containerId, jQ) {

    jQ = jQ || $;
    
    var _parentId = containerId,
        _container = jQ('#' + containerId),
        _fileId = _container.attr('fileid');



    /* Private Members */
    var _dataController = {

        getFile: function (entryId, callback) {

            ibhs.data.getFile(entryId, function (results) {

                if (results.success) {
                    callback(results.data);
                } else {
                    callback(null);
                }// if-else

            });

        }

    };

    var _components = {

        downloadLink: (function (parentId, entryId) {

            var _cache = {
                _handle: null,

                getHandle: function () {

                    if (_cache._handle == null) {
                        _cache._handle = jQ('#' + parentId + '_download');

                    }// if

                    return _cache._handle;
                }

            };

            var _viewController = {

            };

            var _events = {

                click: function () {

                    var $ele = jQ(this);

                },

                bind: function (filePath) {

                    var type = ibhs.common.getExtension(filePath);
                                       
                    // set href path for download
                    _cache.getHandle()
                        .attr('href', filePath)
                        .find('.flink-icon').addClass(ibhs.common.getFileTypeIcon(type));
                        


                }

            };

            return {

                bind: _events.bind

            };

        })(_parentId, _fileId),

        previewLink: (function(parentId, entryId){
            var _cache = {
                _handle: null,
                _filePath: null,

                getHandle: function () {

                    if (_cache._handle == null) {
                        _cache._handle = jQ('#' + parentId + '_preview');

                    }// if

                    return _cache._handle;
                }

            };

            var _viewController = {

            };

            var _events = {

                click: function () {

                    var $ele = jQ(this),
                        type = $ele.attr('filetype');
                          
                    ibhs.common.preview(_parentId + '_preview', _cache._filePath, type);


                },

                bind: function (filePath) {

                    _cache._filePath = filePath;

                    // get file type
                    var regex = new RegExp(/\.(.+$)/i);
                    var match = regex.exec(filePath);
                    var type = (match ? match[1] : '');

                    _cache.getHandle().click(_events.click).attr('filetype', type);

                }

            };

            return {

                bind: _events.bind

            };
        })(_parentId, _fileId),

        preview: (function (parentId) {



        })(_parentId)

    };

    /* Private Helpers */
    var _link = {

        buildVM: function(){

        },

        bind: function (token) {

            // set view model
            var vm = {
                id: _parentId
            };

            // load template
            var template = Handlebars.templates['link-widget.html'];
            var html = template(vm);
            _container.html(html);

            
            // get file and bind components
            _dataController.getFile(_fileId, function (file) {

                if (file) {
                    // build path
                    var download = ibhs.data.getHost() + 'filestore/download/' + token + file.path;
                    //var preview = ibhs.data.getHost() + 'filestore/preview/' + token + file.path;

                    // bind controls
                    _components.downloadLink.bind(download);
                    //_components.previewLink.bind(preview);

                }
            });

        }
    };



    /* Public Interface */
    return {

        initialize: function () {

            // get user session
            ibhs.common.validateSession(function (session) {

                if (session) {

                    _link.bind(session.token);

                } else {
                    // session is not valid
                    console.warn('no session');
                }// if-else
            });

        }

    };


});