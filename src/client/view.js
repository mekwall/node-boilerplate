"use strict"

var w = window;
var d  = document;

var varRxp = /\{\{([a-zA-Z0-9]+)\}\}/;

function ViewBinding (name, node) {
    this.name = name;
    this.nodes = [];
    this.addNode(node);
}
    
ViewBinding.prototype.removeNode = function (node) {
    return this.nodes.slice(this.nodes.indexOf(node), 1);
};
    
ViewBinding.prototype.addNode = function (node) {
    return this.nodes.push(node);
};
    
ViewBinding.prototype.get = function() {
    return this.currentValue;
};
    
ViewBinding.prototype.set = function (val) {
    this.currentValue = val;
    for (var i = 0, len = this.nodes.length; i < len; i++) {
        if (this.nodes[i].nodeType === 1) {
            this.nodes[i].innerHTML = val;
        } else if (this.nodes[i].nodeType === 3) {
            this.nodes[i].textContent = val;
        }
    }
    return val;
};

function View (engine, scope) {
    this.engine = engine;
    this.bindings = {};
    this.scope = scope;
    this._init();
}

View.prototype._init = function (context) {
    var scope = this.scope;
    var self = this;
    var node;
    var nodes = Array.prototype.slice.call(scope.querySelectorAll("[var]"));
    var walk = d.createTreeWalker(scope, NodeFilter.SHOW_TEXT, null, false);
    var match;
    while (node = walk.nextNode()) {
        match = node.textContent.match(varRxp);
        if (match) {
            (function(){
                var name = match[1];
                var elm = node;
                var index = match.index;
                if (index > 0) {
                    elm = node.splitText(index);
                }
                if (elm.textContent.length > match[0].length) {
                    var tmp = elm.splitText(match[0].length);
                }
                elm.name = name;
                elm.nodeValue = "";
                nodes.push(elm);
            }());
        }
    }
    
    var varObjs = [];
    for (var i = 0, len = nodes.length; i < len; i++) {
        (function(){
            var name = nodes[i].name || nodes[i].getAttribute("var");
            if (self.bindings[name]) {
                self.bindings[name].addNode(nodes[i]);
            } else {
                var obj = new ViewBinding(name, nodes[i]);
                self.bindings[name] = obj;
                Object.defineProperty(self, name, {
                    enumerable: true,
                    configurable : true,
                    get: function () {
                        return obj.get();
                    },
                    set: function (val) {
                        return obj.set(val);
                    }
                });
            }
        }());
    }
}
    
View.prototype.update = function (context) {
    for (var key in context) {
        this[key] = context[key];
    }
};

View.prototype.empty = function () {
    this.bindings = {};
    while (this.scope.hasChildNodes()) {
        this.scope.removeChild(this.scope.lastChild);
    }
}

View.prototype.use = function (template) {
    if (this.engine.templates[template]) {
        this.empty();
        this.scope.innerHTML = this.engine.templates[template].innerHTML;
        this._init();
    }
};

function ViewManager (app) {
    this.app = app;
    this.scope = app.scope;
    var elems = this.scope.querySelectorAll("[view]");
    this.app.views = {};
    var name, template;
    for (var i = 0, len = elems.length; i < len; i++) {
        name = elems[i].getAttribute("view");
        template = elems[i].getAttribute("template");
        this.app.views[name] = new View(app, elems[i]);
        if (template) {
            this.app.views[name].use(template);
        }
    }
}

module.exports = function (app) {
    return new ViewManager(app);
}