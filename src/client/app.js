"use strict";

var Engine = require("./engine");
var app = new Engine(document);

app.views.foo.name = prompt("What's your name?");
app.views.foo.age = prompt("What's your age?");