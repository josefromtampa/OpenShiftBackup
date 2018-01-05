(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
Handlebars.partials['file-list-partial.html'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "{hello world}\n    <div class=\"panel panel-default\">\n    <div class=\"fbGroupHeader\" role=\"tab\" id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "_header\" data-toggle=\"collapse\" href=\"#"
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "_panel\" aria-controls=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "_panel\" aria-expanded=\""
    + alias3(((helper = (helper = helpers.opened || (depth0 != null ? depth0.opened : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"opened","hash":{},"data":data}) : helper)))
    + "\" >\n        <h4 class=\"panel-title\">\n        "
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "\n        <i class=\"fa "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.opened : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + " fa-lg\"></i>\n        </h4>\n    </div>\n    <div id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "_panel\"  class=\"panel-collapse collapse "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.opened : depth0),{"name":"if","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\" role=\"tabpanel\" aria-labelledby=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "_header\">\n        <div class=\"fbItemContainer container-fluid\">\n        <div class=\"fbItemList row\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.files : depth0),{"name":"each","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        </div>\n    </div>\n    </div>\n";
},"2":function(depth0,helpers,partials,data) {
    return "fa-chevron-circle-down";
},"4":function(depth0,helpers,partials,data) {
    return "fa-chevron-circle-right";
},"6":function(depth0,helpers,partials,data) {
    return "in";
},"8":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                <div action=\"preview\" class=\"fbItem col col-sm-6 col-md-4 col-lg-3\" path=\""
    + alias3(((helper = (helper = helpers.path || (depth0 != null ? depth0.path : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"path","hash":{},"data":data}) : helper)))
    + "\" ftype=\""
    + alias3(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"type","hash":{},"data":data}) : helper)))
    + "\">\n\n                    <div class=\"fbItem-col1\">\n                        <i class=\"fbItem-icon fa fa-4x fa-file-"
    + alias3(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"type","hash":{},"data":data}) : helper)))
    + "-o\"></i>\n                    </div>\n                    <div class=\"fbItem-col2\">\n                        <div class=\"fbItem-name text-truncate row\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</div>\n                        <div class=\"text-truncate row\">\n                        <label>Tags:</label>\n                        <span class=\"fbItem-tags\">"
    + alias3(((helper = (helper = helpers.tags || (depth0 != null ? depth0.tags : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"tags","hash":{},"data":data}) : helper)))
    + "</span>\n                        </div>\n                        <div class=\"fbItem-date row\">\n                        <label>Date:</label> "
    + alias3(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"date","hash":{},"data":data}) : helper)))
    + "\n                        </div>\n                    </div>\n                    <div class=\"fbItem-col3\">\n                        <i action=\"download\" class=\"fbItem-download fa fa-download fa-lg\" path=\""
    + alias3(((helper = (helper = helpers.path || (depth0 != null ? depth0.path : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"path","hash":{},"data":data}) : helper)))
    + "\"></i>\n                    </div>\n                </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "﻿"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.groups : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
})();