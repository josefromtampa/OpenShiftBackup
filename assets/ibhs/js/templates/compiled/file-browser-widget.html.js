(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['file-browser-widget.html'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "      <div class=\"fBrowserMenu\">\n        <div id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "_menu\" class=\"fbMenu menu\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.categories : depth0),{"name":"each","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n      </div>\n        <div id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "_categoryLabel\" class=\"categoryTitleStyle\"></div>\n";
},"2":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div category=\""
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" class=\"menuItem\" title=\""
    + alias3(((helper = (helper = helpers.display || (depth0 != null ? depth0.display : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"display","hash":{},"data":data}) : helper)))
    + "\">\r\n                <img src=\""
    + alias3(this.lambda(((stack1 = (data && data.root)) && stack1.host), depth0))
    + "/"
    + alias3(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"icon","hash":{},"data":data}) : helper)))
    + "\" alt=\""
    + alias3(((helper = (helper = helpers.display || (depth0 != null ? depth0.display : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"display","hash":{},"data":data}) : helper)))
    + "\" />\r\n            </div>\n";
},"4":function(depth0,helpers,partials,data) {
    var helper;

  return "    <div class=\"fbSearch\">\n      <input id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "_filter\" class=\"fbSearchTextBox form-control\" placeholder=\"search member resources\" />\n    </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "_fbBrowser\" class=\"fBrowser\">\n\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showMenu : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  <div id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "_browserBody\" class=\"fBrowserBody fbBody-margin\">\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showSearch : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n    <div class=\"panel-group results-panel\" id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "_fileContainer\" role=\"tablist\" aria-multiselectable=\"true\">\n        <div class=\"panel panel-default\" rv-each-group=\"groups\" >\n            <div rv-show=\"group.match\">\n                <div class=\"fbGroupHeader fbHeader-margin\" role=\"tab\" rv-id=\"group.id | concat '' '_header'\" data-toggle=\"collapse\" \n                    rv-href=\"group.id | concat '#' '_panel'\" \n                    rv-aria-expanded=\"group.opened\" >\n                    <h4 class=\"panel-title\">\n                        {group.title}\n                        <i class=\"fa fa-lg\" rv-setIconOpened=\"group.opened\"></i>\n                    </h4>\n                </div>\n                <div rv-id=\"group.id | concat '' '_panel'\" class=\"panel-collapse collapse\" \r\n                     rv-class-in=\"group.opened\" \r\n                     rv-aria-expanded=\"group.opened\" \r\n                     rv-panelheight=\"group.opened\"\r\n                     role=\"tabpanel\">\r\n                    <div class=\"fbItemContainer container-fluid\">\r\n                        <div class=\"fbItemList row\">\r\n                            <div rv-each-file=\"group.files\" rv-show=\"file.match\" class=\"fbItem col col-sm-6 col-md-4 col-lg-3\">\r\n                                <a class=\"fbItemBody\" rv-action=\"file\" rv-path=\"file.path\" rv-ftype=\"file.type\" rv-title=\"file.name\">\r\n                                    <div class=\"fbItem-col1\">\r\n                                        <i class=\"fbItem-icon fa\" rv-setfileicon=\"file.type\"></i>\r\n                                    </div>\r\n                                    <div class=\"fbItem-col2\">\r\n                                        <div class=\"fbItem-name text-truncate row\">{file.name}</div>\r\n                                        <div class=\"text-truncate row\">\r\n                                            <label>Tags:</label>\r\n                                            <span class=\"fbItem-tags\">{file.tags}</span>\r\n                                        </div>\r\n                                        <div class=\"fbItem-date row\">\r\n                                            <label>Date:</label> { file.date | formatdate }\r\n                                        </div>\r\n                                    </div>\r\n                                </a>\r\n                                <!--<div class=\"fbItem-col3\">-->\r\n                                <a rv-href=\"file.path | getdllink\"><i action=\"download\" class=\"fbItem-download fa fa-download\"></i></a>\r\n                                <!--</div>-->\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </div>\n            </div>\n        </div>\n      <div rv-hide=\"hasResults\" class=\"noresults-panel\">\r\n          No Results\r\n      </div>\n    </div>\n    <div id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "_loadingPanel\" class=\"loading-panel\">\r\n        <i class=\"fa fa-spinner fa-spin fa-5x\"></i>\r\n    </div>\n  </div>\n\n    <div id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "_previewoverlay\" class=\"preview-overlay no-display animated-3\">\n        <i id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "_previewclose\" class=\"previewCloseStyle fa fa-times fa-3x\"></i>\n        <div id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "_preview\" class=\"preview\">\r\n        </div>\n    </div>\n\n\n</div>\n";
},"useData":true});
})();