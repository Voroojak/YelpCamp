var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    localStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    connectFlash    = require("connect-flash"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");

// Requring routes
var commentRoutes   = require("./routes/comments"),
    campgroundRoutes= require("./routes/campgrounds"),
    indexRoutes     = require("./routes/index");
    
// FOR NOW I AM USING A DIFFERENT DB
// mongoose.connect("mongodb://localhost/yelp_camp");
// mongoose.connect("mongodb://localhost/yelp_camp_2");
// mongoose.connect("mongodb://ario:UNV-pL5-Bbk-RnH@ds239309.mlab.com:39309/yelpcamp");

// Switching to environment variable and setting a default value.
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_2";
mongoose.connect(url);
// console.log(url);
// console.log(process.env.DATABASEURL);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
// seedDB(); // seed the database
app.use(methodOverride("_method"));
app.use(connectFlash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "I am setting this as my secret",
    resave: false,
    saveUninitialized: false
}));
app.locals.moment = require("moment");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// console.log(__dirname);

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp server has started");
})