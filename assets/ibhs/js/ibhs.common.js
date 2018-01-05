
ibhs = window.ibhs || {};

// common namespace
ibhs.common = (function ($) {

    /* Private Members */



    /* Helpers */
    /*** Helper namespace for responses ***/
    var _responseHandler = {

        handleError: function (e, callback) {

            console.error(e.message);

            if (callback) {
                callback({ error: e });
            } else {
                throw e;
            }// if-else
        },

        handleResponse: function (success, data, callback, message) {

            var resp = {
                success: success,
                data: data
            };

            if (message) {
                resp.message = message;
            }// if

            if (callback) {
                callback(resp);
            } else {
                return resp;
            }// if-else

        }
    };

    /*** Helper namespace for browser functions ***/
    var _browser = {

        environment: {
            //mobile or desktop compatible event name, to be used with '.on' function
            TOUCH_DOWN_EVENT_NAME: 'mousedown touchstart',
            TOUCH_UP_EVENT_NAME: 'mouseup touchend',
            TOUCH_MOVE_EVENT_NAME: 'mousemove touchmove',
            TOUCH_DOUBLE_TAB_EVENT_NAME: 'dblclick dbltap',

            isAndroid: function() {
                return navigator.userAgent.match(/Android/i);
            },
            isBlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            isIOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            isOpera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            isWindows: function() {
                return navigator.userAgent.match(/IEMobile/i);
            },
            isMobile: function() {
                return (_browser.environment.isAndroid() || _browser.environment.isBlackBerry() || _browser.environment.isIOS() || _browser.environment.isOpera() || _browser.environment.isWindows());
            },
            isIE: function (versionCheck) {

                function getInternetExplorerVersion()
                    // Returns the version of Internet Explorer or a -1
                    // (indicating the use of another browser).
                {
                    var rv = -1; // Return value assumes failure.
                    if (navigator.appName == 'Microsoft Internet Explorer') {
                        var ua = navigator.userAgent;
                        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                        if (re.exec(ua) != null)
                            rv = parseFloat(RegExp.$1);
                    }
                    return rv;
                }

                var ieVer = getInternetExplorerVersion();

                // if version check exists then compare version, otherwise just check if it's ie or not
                return versionCheck ? versionCheck <= ieVer : ieVer != -1;
            }
        },

        previewVideo: function (containerId, source, type, width, height) {

            if (containerId && source) {

                var w = width || window.innerWidth * .8,
                    h = height || window.innerHeight * .8;

                $('#' + containerId).media({
                    width: w,
                    height: h,
                    autoplay: true,
                    src: source
                    
                });
                
            }// if

        },

        previewDoc: function (containerId, source, width, height) {

            if (containerId && source) {

                // set default
                var w = width || window.innerWidth * .8,
                    h = height || window.innerHeight * .8;

                $('#' + containerId).media({
                    width: w,
                    height: h,
                    src: source
                });


            }// if

        },

        hidePreview: function(containerId){


            var $ele = $('#' + containerId);
               
            if (Modernizr && Modernizr.cssanimations) {

                $ele.removeClass('fadeInDown')
                   .addClass('fadeOutUp')
                   .delay(300).queue(function (next) {
                       $ele.addClass('no-display');
                       $('body').css('overflow', 'auto');
                       next();
                   });
            } else {
                $ele.removeClass('fadeInDown').addClass('no-display').css('opacity', 0);
                $('body').css('overflow', 'auto');
            }

        },

        showPreview: function(containerId){

            if (Modernizr && Modernizr.cssanimations) {
                $('#' + containerId).css('opacity', 0).removeClass('no-display').removeClass('fadeOutUp').addClass('fadeInDown');
            } else {
                $('#' + containerId).css('opacity', 1).removeClass('no-display').removeClass('fadeOutUp');
            }
        },

        preview: function (containerId, source, type) {

            // load preview
            switch (type.toLowerCase()) {

                case 'txt':
                case 'rft':
                case 'doc':
                case 'docx':
                case 'pdf':
                    // pdf
                    $('body').css('overflow', 'hidden');
                    _browser.previewDoc(containerId, source);
                    break;

                case 'mp4':
                case 'wmv':
                    // video
                    $('body').css('overflow', 'hidden');
                    _browser.previewVideo(containerId, source, type);

                    break;
                    
                default:
                    // not supported
                    alert('Preview not supported for ' + type + ' formats');
                    break;



            };
        }
        
    };

    /*** Helper for Session managment ***/
    var _session = {

        getToken: function () {
            // get token from local storage
            return localStorage.getItem('ibhs_access_token');
        },

        getSession: function () {

            // get user from local storage
            var sessionJSON = localStorage.getItem('ibhs_user');

            if (sessionJSON) {
                var session = ($ ? $.parseJSON(sessionJSON) : JSON.parse(sessionJSON));

                if (session && session.expiry && new Date(session.expiry) > (new Date())) {
                    return session
                }// if

            }// if

            return null;
        },

        validate: function (callback) {

            var session = _session.getSession();

            if (session) {
                if (callback) {
                    callback({ valid: true, session: session, token: _session.getToken() });
                }// if
            } else {
                console.warn('Session expired');
                //alert('Session expired, please login again and refresh');

                callback({ valid: false });
            }// try-catch

        }
    };

    /*** Helper namespace for utility functions ***/
    var _common = {

        _timer: 0,

        delay: function (callback, ms) {
            clearTimeout(_common._timer);
            _common._timer = setTimeout(callback, ms);            
        },

        getFileIcon: function (type) {
            
            // set fa file icon
            switch (type) {

                case 'ppt':
                case 'pptx':
                    return 'fa-file-powerpoint-o';

                case 'xls':
                case 'xlsx':
                    return 'fa-file-excel-o';

                case 'png':
                case 'jpg':
                case 'jpeg':
                case 'bpm':
                case 'gif':
                case 'tif':
                    return 'fa-file-image-o';

                case 'mp3':
                case 'wav':
                case 'wma':
                case 'flac':
                case 'm4a':
                case 'wv':
                    return 'fa-file-audio-o';

                case 'mov':
                case 'mp4':
                case 'mpg':
                case 'mpeg':
                case 'avi':
                case 'm2v':
                case 'm4v':
                case 'wmv':
                    return 'fa-file-video-o';

                case 'doc':
                case 'docx':
                    return 'fa-file-word-o';

                case 'zip':
                case 'rar':
                case 'tar':
                case '7z':
                    return 'fa-file-archive-o';

                case 'txt':
                case 'rft':
                    return 'fa-file-text-o';

                case 'pdf':
                    return 'fa-file-pdf-o';

                default:
                    return 'fa-file-o';

            };
            
        },

        getExtension: function (file) {


            var regex = new RegExp(/\.(.+$)/i);
            var match = regex.exec(file);

            if (match) {
                return match[1];
            } // if

            return null;

        }

    };
   
    /*** Helper namespace for event functions ***/
    var _eventHandler = {


    };


    /* public */
    return {

        handleError: _responseHandler.handleError,
        handleResponse: _responseHandler.handleResponse,

        preview: _browser.preview,
        showPreview: _browser.showPreview,
        hidePreview: _browser.hidePreview,
        isMobile: _browser.environment.isMobile,
        isIE: _browser.environment.isIE,

        getToken: _session.getToken,
        getSession: _session.getSession,
        validateSession: _session.validate,
        delay: _common.delay,

        getFileTypeIcon: _common.getFileIcon,
        getExtension: _common.getExtension
        

    };


})(jQuery);