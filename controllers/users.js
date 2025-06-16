
const User = require("../models/user.js");



module.exports.renderSignupForm = (req, res) => {              //  route to render form for signup
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res, next) => {       //   save data from signup form in to database
    try {
        let { username, email, password } = req.body;
        let newUser = await User({
            username: username,
            email: email
        })
        let registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                next(err);
            }
            console.log(registeredUser);
            req.flash("success", `Hi ${username} ! Welcome to Wander-Lust :)`)
            res.redirect("/listings");
        })
    }
    catch (err) {
        console.log(err.message);
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}


module.exports.renderLoginForm = (req, res) => {                //  route to render the login form
    res.render("users/login.ejs");
}


module.exports.login = async (req, res) => {                        //  login the user
    let redirectUrl = res.locals.redirectUrl || "/listings";
    req.flash("success", "Welcome back to Wander Lust :)");
    res.redirect(redirectUrl);
}


module.exports.logout = (req, res) => {                             //  logout the user
    req.logOut((err) => {
        if (err) {
            return err;
        }
        req.flash("success", "Logged out successfully");
        res.redirect("/listings");
    })
}