"use strict";

var TemplateManager = require("./template");
var ViewManager = require("./view");

function Engine (scope) {
	this.scope = scope;
	this.use(TemplateManager);
	this.use(ViewManager);
	return this;
}

Engine.prototype.use = function (module) {
	module(this);
	return this;
}

module.exports = Engine;