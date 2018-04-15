var express     = require("express"),
    router      = express.Router(),
    middleware  = require("../middleware"),
    Campground  = require("../models/campground");
    
// INDEX - show all campgrounds
router.get("/", function(req, res) {
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCamps) {
        if(err) {
            console.log(err);
        } else {
            res.render("./campgrounds/index", {campgrounds: allCamps, page: "campgrounds"});
        }
    });
});

// CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
    // get data from form and add to campgrounds array
    var name            = req.body.name,
        price           = req.body.price,
        image           = req.body.image,
        desc            = req.body.description,
        author          = {
            id: req.user._id,
            username: req.user.username
        },
        newCampground   = {name: name, price: price, image: image, description: desc, author: author};
        // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            // Redirect back to the campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("./campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res) {
    // find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err || !foundCampground) {
            req.flash("error", "Campground not found.");
            res.redirect("back");
        } else {
            // console.log(foundCampground);
            // render show template with that campground
            res.render("./campgrounds/show", {campground: foundCampground});
        }
    });
});

// Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err) {
            req.flash("error", "Campground not found.");
            res.redirect("/campgrounds");
        } else {
            res.render("./campgrounds/edit", {campground: foundCampground});
        }
    });
});

// Update campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    // find and update correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if(err) {
            req.flash("error", "Campground not found.");
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    // redirect somewhere(show page)
});

// Destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;