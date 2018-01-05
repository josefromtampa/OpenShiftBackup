
ibhs = window.ibhs || {};
ibhs.widgets = ibhs.widgets || {};

ibhs.widgets.fileBrowser = (function (containerId, jQ) {

    jQ = jQ || $;

    /* Private members */
    var _parentId = containerId,
        _container = jQ('#' + containerId),
        _viewName = _container.attr('view');


  /* Private Helpers */

    var _menu = (function(parentId){

        /* Private Members */
        var _this = this;
        var  _options = {
            items: 15,
            itemsDesktop: [900, 15],
            itemsDesktopSmall: [850, 10],
            itemsTablet: [750, 8],
            itemsMobile: [650, 5],
            slideSpeed: 300,
            navigation: true,
            navigationText : ["",""],
            pagination: false,
            paginationSpeed: 300,
            rewindSpeed: 400
        };


        var _cache = {

            _handle: null,
            _activeMenu: null,
            _title: null,

            getHandle: function () {

                if (_cache._handle == null) {
                    _cache._handle = jQ('#' + parentId + '_menu');

                }// if

                return _cache._handle;
            },

            getLabel: function () {

                if (_cache._title == null) {
                    _cache._title = jQ('#' + parentId + '_categoryLabel');

                }// if

                return _cache._title;
            }
        };


        /* View Controller */
        var _viewController = {

            bind: function () {

                // bind menu
                var $menu = _cache.getHandle();
                $menu.owlCarousel(_options);

                // bind menu click event
                $menu.on('click', '.menuItem', _events.click);

                $menu.find('.owl-prev').html('<i class="fa fa-angle-double-left"></i>');
                $menu.find('.owl-next').html('<i class="fa fa-angle-double-right"></i>');

                // set active menu
                _viewController.setActive();

                jQ('[data-toggle="tooltip"]').tooltip();

            },

            setActive: function ($ele) {

                if ($ele == undefined || $ele == null) {
                    var $menuItems = _cache.getHandle().find('.menuItem');
                    $ele = jQ($menuItems[0]);
                }// if-else

                var cat = $ele.attr('category');
                var title = $ele.attr('title');

                // set selected if different
                if (_cache._activeMenu == null || cat != _cache._activeMenu.attr('category')) {
                                      
                    $ele.addClass('active-menu');

                    if (_cache._activeMenu != null) {
                        _cache._activeMenu.removeClass('active-menu');
                    }// if


                    // cache active menu item
                    _cache._activeMenu = $ele;

                    _cache.getLabel().html(title.toUpperCase());

                }// if
            }
        };
        
        /* Events Controller */
        var _events ={
            click: function () {

                var $ele = jQ(this);
                // set as active menu item
                _viewController.setActive($ele);
                var cat = $ele.attr('category');


                // set selected category
                _fileList.refresh(cat);
            }
        };

        /* Public Interface */
        return {

            getCategory: function(){
                return _cache._activeMenu.attr('category');
            },

            bind: _viewController.bind
        };
            

    })(_parentId);

  var _fileList = (function(parentId){
      
      /* Private Members */
      var _this = this;

      /* Control Cache */
      var _cache = {
          _internal: this,
          dataCache: null,
          _handle: null,
          _filterHandle: null,
          _loadingPanel: null,
          _previewClose: null,
          _previewBody: null,
          _token: null,
          _vm: { groups: [] },

          getHandle: function(){

              if (_cache._handle == null){
                  _cache._handle = jQ('#' + parentId + '_fileContainer');
              }// if

              return _cache._handle;

          },

          getFilterHandle: function () {

              if (_cache._filterHandle == null) {
                  _cache._filterHandle = jQ('#' + parentId + '_filter');
              }// if

              return _cache._filterHandle;
          },

          getLoadingPanel: function () {

              if (_cache._loadingPanel == null) {
                  _cache._loadingPanel = jQ('#' + parentId + '_loadingPanel');
              }// if

              return _cache._loadingPanel;
          },

          getPreviewClose: function () {

              if (_cache._previewClose == null) {
                  _cache._previewClose = jQ('#' + parentId + '_previewclose');
              }// if

              return _cache._previewClose;
          },

          getPreviewBody: function () {

              if (_cache._previewBody == null) {
                  _cache._previewBody = jQ('#' + parentId + '_preview');
              }// if

              return _cache._previewBody;
          }

      };

      /* Data Controller */
      var _dataController = {

          filter: function (category, criteria) {

              try {

                  criteria = (criteria ? criteria.trim() : '');
                  var filter = new RegExp(criteria, 'i');

                  var filtered = [];
                  var curGroup = null;
                  var curFile = null;
                  var match = false;
                  _cache._vm.hasResults = false;

                  if (_cache._vm.groups) {

                      var firstMatchIdx = null;

                      for (var i = _cache._vm.groups.length; i--;) {

                          match = false;
                          curGroup = _cache._vm.groups[i];
                          for (var j = curGroup.files.length; j--;) {

                              curFile = curGroup.files[j];

                              // check if file is matched by category, name, and tags
                              if ((curFile.category.toLowerCase() == category.toLowerCase() || category.toLowerCase() == 'all')
                                  && (criteria == '' || filter.test(curFile.name) || filter.test(curFile.tags))) {

                                  _cache._vm.groups[i].files[j].match = true;
                                  match = true;
                                  _cache._vm.hasResults = true;
                              } else {
                                  _cache._vm.groups[i].files[j].match = false;
                              }// if-else

                          }// for

                          _cache._vm.groups[i].match = match;
                          _cache._vm.groups[i].opened = false;

                          // get first group that is matched - since this iterates from the end of the list just keep setting to get the last one
                          if (match) {
                              firstMatchIdx = i;
                          }// if
                          
                      }// for

                      if (firstMatchIdx != null) {
                          _cache._vm.groups[firstMatchIdx].opened = true;
                      }// if


                  }// if

                  
              } catch (e) {

                  console.error('Filebrowser filter error - ' + e.message);
              }// try-catch



          }
      };

      /* View Controller */
      var _viewController = {
          
          bind: function (groups, token) {

              _cache._token = token;
              
              // set first group to open
              if (groups && groups.length > 0) {
                  groups[0].opened = true;
              }// if

              var $ctrl = _cache.getHandle();
              _cache.dataCache = groups;
              _cache._vm = { hasResults: true, groups: groups };

              rivets.bind($ctrl, _cache._vm);
              
                // bind collapse/expand event
                $ctrl.on('hide.bs.collapse', function (e) {

                    jQ(e.target).prev().find('i')
                    .removeClass('fa-chevron-circle-down')
                    .addClass('fa-chevron-circle-right');

                }).on('show.bs.collapse', function (e) {

                    jQ(e.target).prev().find('i')
                    .removeClass('fa-chevron-circle-right')
                    .addClass('fa-chevron-circle-down');

                }).on('click', '.fbItemBody', _events.preview);

                // remove loading and show
                _cache.getLoadingPanel().fadeOut('fast', function () {
                    $ctrl.fadeIn();
                });


                // set key down event for filter
                _cache.getFilterHandle().keyup(function (event) {
                    
                    ibhs.common.delay(function () {
                        _events.filter();
                    }, 500);
                });

                _cache.getPreviewClose().click(function () {
                    ibhs.common.hidePreview(_parentId + '_previewoverlay');
                    _cache.getPreviewBody().html('');
                });
          }
      };

      /* Events Controller */
      var _events = {

          filter: function(category){
                            
              category = category || _menu.getCategory();

              // get filter value
              var filter = _cache.getFilterHandle().val();

              // filter data
              var data = _dataController.filter(category, filter);

          },

          preview: function (e) {
                            
                // stop bubbling
                e.preventDefault();
                e.stopPropagation();

              // get params
              var $ele = jQ(this),
                    action = $ele.attr('action'),
                    path = $ele.attr('path'),
                    type = $ele.attr('ftype');

              switch (type) {
                  case 'pdf':
                  case 'mp4':
                  case 'wmv':
                      
                      // preview
                      ibhs.common.preview(_parentId + '_preview', ibhs.data.getHost() + 'filestore/preview/' + _cache._token + '/' + path, type);
                      ibhs.common.showPreview(_parentId + '_previewoverlay');
                      break;
                      
                  default:
                      // download

                      break;
              };

          }
      };

      /* Public Interface */
      return {
          refresh: _events.filter,
          bind: _viewController.bind
      };

  })(_parentId);

  var _fileBrowser = {

      initBindiers: function(token){

          rivets.formatters.getdllink = function (value) {
              return ibhs.data.getHost() + 'filestore/download/' + token + value;
          };

          rivets.formatters.concat = function (value, prefix, postfix) {

              return prefix + value.replace(/&/i, '') + postfix;
          };
          
          rivets.binders.seticonopened = function (el, value) {

              jQ(el).removeAttr('rv-setIconOpened')
                .removeClass((value ? 'fa-chevron-circle-right' : 'fa-chevron-circle-down'))
                .addClass((value ? 'fa-chevron-circle-down' : 'fa-chevron-circle-right'));
            
          };

          rivets.binders.setfileicon = function (el, value) {

              var $ele = jQ(el).removeAttr('rv-setFileIcon');

              $ele.addClass(ibhs.common.getFileTypeIcon(value));
              
          };

          rivets.binders.action = function (ele, file) {
              
              var $ele = jQ(ele).removeAttr('rv-action');

              // only preview for defined types and if not mobile
              if (file.type == 'pdf'
                  && !ibhs.common.isMobile()
                  && !ibhs.common.isIE(9)) {

                  $ele.attr('action', 'preview');
              } else {
                  // set as download link
                  $ele.attr('href', ibhs.data.getHost() + 'filestore/download/' + token + file.path).removeClass('fbItemBody').addClass('fbItemBody-dl');

              }// if-else

          };


          rivets.binders.panelheight = function (ele, opened) {

              var $ele = jQ(ele).removeAttr('rv-panelheight');

              // only preview for defined types and if not mobile
                $ele.css('height', (opened ? 'auto' : '0px'));
             

          };

          rivets.formatters.formatdate = function (date) {

              return (new Date(date)).toLocaleString();
          };

      },
      
      bind: function (session) {
          
          // get view
          ibhs.data.getView(_viewName, function (resp) {

              if (resp.success) {
                  var view = resp.data;

                  var vm = {
                      id: _parentId,
                      name: view.name,
                      showMenu: view.showMenu,
                      showSearch: view.showSearch,
                      categories: view.categories,
                      defaultCategory: view.defaultCategory,
                      host: ibhs.data.getHost()
                  };
                  
                  // check if user is part of a committee, if so, then remove committees category
                  if (!session.session.user.committees || session.session.user.committees.length < 1) {
                    
                      var idx = -1;
                      for (var i = 0; i < vm.categories.length; i++) {
                          // find committees
                          if (vm.categories[i].name == 'committees') {
                              idx = i;
                              break;
                          }// if
                      }// for

                      if (idx > -1) {
                          vm.categories.splice(idx, 1);
                      }// if

                  }// if


                    var template = Handlebars.templates['file-browser-widget.html'];
                    var html = template(vm);

                    // add html to container
                    _container.html(html);

                    if (vm.showMenu) {
                        _menu.bind();
                    } else {
                        jQ('#' + _parentId + '_browserBody').removeClass('fbBody-margin');
                        jQ('.fbGroupHeader').removeClass('fbHeader-margin');
                    }// if-else

                  // bind file browser
                    _fileList.bind(view.groups, session.token);

                  // set initial view
                    _fileList.refresh(vm.defaultCategory);
                                    
              }// if-else

          });


      }

  };


  /* Public Interface */
  return {

      initialize: function () {

          // get user session
          ibhs.common.validateSession(function (session) {

              if (session) {

                  _fileBrowser.initBindiers(session.token);

                  _fileBrowser.bind(session);

              } else {
                  // session is not valid
                  console.warn('no session');
              }// if-else
          });

      }

  };

});
