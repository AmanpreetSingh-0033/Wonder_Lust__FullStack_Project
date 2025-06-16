const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middlewares.js");
const ExpressError = require("../utils/ExpressError.js");                    //  for custom error handling

const userController = require("../controllers/users.js")



////////////////            routes


router.route("/signup")
    .get(userController.renderSignupForm)           //      render signup form
    .post(wrapAsync(userController.signup));        //   save data from signup form in to database



router.route("/login")
    .get(userController.renderLoginForm)                   //  route to render the login form

    //  user will login if entered data is correct for that user .....this will be authenticated by the passpost.authenticate automatically that we use in put route
    .post(saveRedirectUrl,
        passport.authenticate("local",
            {
                failureRedirect: "/login",
                failureFlash: true
            }),
        userController.login
    );


/////////////////////////////           this route allow the user to logout 
router.get("/logout", userController.logout);


module.exports = router;