"use strict"

function TemplateManager (app) {
	this.app = app;
	this.scope = app.scope;
	app.templates = {};
	var elems = this.scope.querySelectorAll("template");
	for (var i = 0, len = elems.length; i < len; i++) {
		app.templates[elems[i].getAttribute("name")] = elems[i].parentNode.removeChild(elems[i]);
	}
}

module.exports = function (app) {
	return new TemplateManager(app);
}