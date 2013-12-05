// Lib deps
const express = require("express.io");
const app = express().http().io();
const browserify = require("browserify-middleware");
const env = process.env.NODE_ENV;

// Load config
var conf = require("yamljs").load("./config.yaml");
app.config = conf.environment[env] || conf.environment.default;

// Configure app
app.configure(function () {
    app.set("view engine", "jade");
    app.use(express.cookieParser());
    app.use(express.session({
        secret: app.config.secret
    }));
    app.use(express.static("./public"));
});

// Server browserify bundle
app.get("/js/app.js", browserify("./client/entry.js"));

// Include routes
require("./routes")(app);

var port = app.config.port || 8080;
app.listen(port, function(){
    console.log("Listening to", port);
});