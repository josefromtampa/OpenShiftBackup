/*
    Name: ibhs.portal.js
    Description: This script manages the embedded widget loading functionality.
    Requirements:
                    - jQuery
*/
(function () {

    try {
        var _mode = 'prod';
        var host = (_mode == 'prod' ? window.location.protocol + '//memberportal-ibhs.rhcloud.com/' : (_mode == 'test' ? window.location.protocol + '//test-ibhs.rhcloud.com/' : window.location.origin + '/'));
        var scriptName = "ibhs.portal.js"; 
        var jQuery; //noconflict reference to jquery
        var jqueryPath = host + 'components/jquery/jquery.min.js';
        var _loadWidgets = _mode == 'dev';

        /******** helper function to load external scripts *********/
        function loadScript(src, onLoad) {
            var script_tag = document.createElement('script');
            script_tag.setAttribute("type", "text/javascript");
            script_tag.setAttribute("src", src);

            if (script_tag.readyState) {
                script_tag.onreadystatechange = function () {
                    if (this.readyState == 'complete' || this.readyState == 'loaded') {
                        if (onLoad) {
                            onLoad();
                        }// if
                    }
                };
            } else if (onLoad) {
                script_tag.onload = onLoad;
            }
            (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
        }

        /******** helper function to load external css  *********/
        function loadCss(href) {
            var link_tag = document.createElement('link');
            link_tag.setAttribute("type", "text/css");
            link_tag.setAttribute("rel", "stylesheet");
            link_tag.setAttribute("href", href);
            (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(link_tag);
        }

        /******** load jquery into 'jQuery' variable then call main ********/
        function initResources(done) {

            try {

                // load styles
                loadCss(host + 'components/fontawesome/css/font-awesome.min.css');
                loadCss(host + 'components/owl-carousel/owl.carousel.css');
                loadCss(host + 'components/owl-carousel/owl.theme.css');
                loadCss(host + 'ibhs/styles/ibhs.css');

                // load scripts
                loadScript(host + 'components/modernizr/modernizr.min.js');
                loadScript(host + 'components/owl-carousel/owl.carousel.min.js');
                loadScript(host + 'components/jquery.media/jquery.media.js');
                loadScript(host + 'components/handlebars/handlebars-v3.0.0.js', function () {
                    loadScript(host + 'ibhs/js/templates/compiled/file-browser-widget.html.js');
                    loadScript(host + 'ibhs/js/templates/compiled/link-widget.html.js');
                    loadScript(host + 'components/rivets/rivets.bundled.min.js', function () {
                        loadScript(host + 'ibhs/js/ibhs.common.js', function () {
                            loadScript(host + 'ibhs/js/ibhs.data.js', function () {
                                loadScript(host + 'ibhs/js/ibhs.widget.link.js', function () {
                                    loadScript(host + 'ibhs/js/ibhs.widget.filebrowser.js', done);
                                });
                            });
                        });

                    });
                });
            } catch (e) {
                console.error('Exception initializing widget resources - ' + e.message);
            }// try-catch
        }

        function initjQuery() {
            jQuery = window.jQuery;//.noConflict(true);


            // check for bootstrap
            if (typeof (jQuery.fn.popover) == 'undefined') {
                loadCss(host + 'components/bootstrap/css/bootstrap.min.css');
                loadScript(host + 'components/bootstrap/js/bootstrap.min.js', function () {
                    initResources(main);
                });
            } else {

                initResources(main);
            }// if-else
        }
 

        /******** widget ********/
        function main() {

            try {

                jQuery(document).ready(function ($) {

                    var classStatus = jQuery('body').attr('class').match('body-class-logged-in');
                    _loadWidgets = _loadWidgets || (classStatus != null && classStatus != undefined);

                    // find widgets
                    var fbWidgets = jQuery('div[widget]');

                    if (fbWidgets && fbWidgets.length > 0 && _loadWidgets) {

                        // iterate through all widets and initialize
                        for (var i = fbWidgets.length; i--;) {

                            (function (widget) {

                                var $handle = $(widget);
                                var type = $handle.attr('widget');
                                var id = $handle.attr('id');

                                // generate random id if not set
                                if (id == undefined || id == null) {
                                    id = Math.random().toString().replace('0.', '');
                                    $handle.attr('id', id);
                                }// if

                                switch (type) {
                                    case 'browser':
                                        // initialize browser widget
                                        var fb = new ibhs.widgets.fileBrowser(id, $);
                                        fb.initialize();
                                        break;

                                    case 'link':

                                        // initialize link widget
                                        var link = new ibhs.widgets.link(id, $);
                                        link.initialize();
                                        break;
                                };

                            })(fbWidgets[i]);

                        }// for

                    }// if

					
					if (!_loadWidgets){
						localStorage.removeItem('ibhs_access_token');
						localStorage.removeItem('ibhs_user');
					}// if
                });

            } catch (e) {
                console.warn('Error loading widgets - ' + e.message);
            }// try-catch

        }


        /****** Start Initialization ******/
        if (window.jQuery === undefined) {
            loadScript(jqueryPath, initjQuery);
        } else {
            initjQuery();
        }

    } catch (e) {
        console.warn('Exception checking for widgets - ' + e.message);
    }// try-catch

})();