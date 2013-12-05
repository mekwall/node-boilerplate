const fs = require("fs");
const mime = require("mime");
const path = require("path");

module.exports = function (app) {

    app.get("/", function (req, res, next) {
        res.render("index");
    });

    app.io.route("ready", function (req) {
        req.io.respond({
            success: "hello!"
        });
        req.session.save(function() {
            req.io.emit("session", req.session);
        });
    });

};