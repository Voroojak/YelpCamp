var express = require("express"),
    router  = express.Router(),
    User    = require("../models/user"),
    passport= require("passport");

// Root route
router.get("/", function(req, res) {
    res.render("landing");
});

// show registrasion form
router.get("/register", function(req, res) {
    res.render("./authentication/register", {page: "register"});
});

// handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            req.flash("error", err.message);
            // console.log(err);
            // This or
            // return res.render("./authentication/register");
            // This one
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to Yelpcamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", function(req, res) {
    res.render("./authentication/login", {page: "login"});
});

// handeling login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) {
});

// logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("campgrounds");
});

// Unavalable page route
router.get("*", function(req, res) {
    res.render("unavailable");
});

module.exports = router;