
if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}


const express = require("express");                                         //  express
const app = express();
const port = 8080;                                                          // define local host
const path = require("path");                                               // require path to connect with parent directories
const methodOverride = require("method-override");                          // method overtide to override the requests
const ejsMate = require("ejs-mate");                                        //  ejs mate for templating        

const ExpressError = require("./utils/ExpressError.js");                    //  for custom error handling
const Joi = require("joi");                                                 //  for server side schema validation

const mongoose = require("mongoose");                                       // require mongoose to for database
const listingRouter = require("./routes/listings.js");                      //  router object for listings
const reviewsRouter = require("./routes/reviews.js");                       //  router object for posts
const userRouter = require("./routes/user.js");                             //  router object for posts

const session = require("express-session");                                 //  for get session id in our server
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");                                     //  for using flash messages

const passport = require("passport");                                       //  for authentication
const LocalStrategy = require("passport-local");                            //  local strategy for user schema
const User = require("./models/user.js");
const { error } = require('console');



app.listen(port, () => {
    console.log(`app is listing on port : ${port}`);
})
app.set("view engine", "ejs");                                              //   set view engine to ejs for use the templating 
app.set("views", path.join(__dirname, "/views"));                           //   serve path to views directory
app.use(express.static(path.join(__dirname, "/public")));                   //   serve path to public directory
app.use(express.urlencoded({ extended: true }));                            //   to parse the data from request
app.use(express.json());                                                    //   to parse the jdon data
app.use(methodOverride("_method"));                                         //   to override the path method
app.engine("ejs", ejsMate);                                                 //   ejs mate - use for templating

app.get("/", (req, res) => {                                                // root path
    console.log("this is a root path");
    res.render("/listings");
})


////////////////////////////////// //////////////////////////         setup connection with mongo database

const db_Url = process.env.ATLAS_URL;
// const local_mongoUrl = process.env.LOCAL_MONGOURL;

// const db_Url = process.env.LOCAL_MONGOURL;


main()
    .then((res) => {
        console.log("connection with database : successful");               // call main() funciton to initilize connection
    })
    .catch((err) => {
        console.log(err);
    })
async function main() {
    await mongoose.connect(db_Url);        //  setup connection with database
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////


const store = MongoStore.create({
    mongoUrl: db_Url,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600
});

store.on("error",(err)=>{
    console.log("Error in MONGO SESSION STORE :  ", err);
})

const sessionOptions = {
    store : store,
    secret: process.env.SECRET,                                               //   some important key value pairs for session 
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};






app.use(session(sessionOptions));                                       //  session for assign the session id 
app.use(flash());                                                       //  for initialize flash messages


/////////////////////////////////////////////////////////////////////////////////////////


///   configuring stratigies
app.use(passport.initialize());                                        //  to initilize passport for every request
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


/////   to manage data related to User in different session i.e. store or remove data from sessions 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.success = req.flash("success");          //  assign flash success or error message 
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


//////////////////////////////             listings routes   and  reviews routes



app.use("/listings", listingRouter);                                          //  redirect use to listing routes 
app.use("/listings/:id/reviews", reviewsRouter);                              //  redirect use to review routes
app.use("/", userRouter);                                                     //  redirect use to review routes





// if any path not found
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found  !"));
})



////////////////////////////////                                        Error Handling routes and middle wares

app.use((err, req, res, next) => {
    if (err.name === "CastError") {
        next(new ExpressError(400, "Casting Error : Recheck your data ! "))         //  custom error middleware for "Cast Errors"
    } else {
        next(err);
    }
})


app.use((err, req, res, next) => {
    console.log(err);                                               //   custom error handling middleware
    let { statusCode = 500, message = "Something went wrong !" } = err;
    res.status(statusCode).render("error.ejs", { statusCode, message });
    // res.status(statusCode).send(message);
});

