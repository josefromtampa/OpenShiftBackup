(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['file-browser-widget.html'] = template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "        <i category=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" class=\"menuItem fa fa-bomb fa-4x\"></i>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "_fBrowser\" class=\"fBrowser\">\n  <div class=\"fBrowserMenu\">\n    <div id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "_menu\" class=\"fbMenu menu\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.categories : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n    </div>\n  </div>\n  <div class=\"fBrowserBody\">\n    <div class=\"fbSearch\">\n      <input id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "_filter\" class=\"fbSearchTextBox form-control\" placeholder=\"search member resources\" />\n    </div>\n\n    <div class=\"panel-group\" id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "_fileContainer\" role=\"tablist\" aria-multiselectable=\"true\">\n"
    + ((stack1 = this.invokePartial(partials['file-list-partial.html'],depth0,{"name":"file-list-partial.html","data":data,"indent":"     ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "    </div>\n\n  </div>\n\n\n</div>\n</div>\n";
},"usePartial":true,"useData":true});
})();