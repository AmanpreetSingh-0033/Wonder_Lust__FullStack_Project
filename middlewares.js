/////////////           this file include middlewares that are used in our project


const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const {listingSchema , reviewSchema} = require("./schema.js");



// posspost's authenticate function to check that user is logged in or not  ?  
module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        console.log(req.session.redirectUrl );
        req.flash("error", "You must be login first");
        return res.redirect("/login");
    } else {
        next();
    }
}



////////////////        middleware to sace to req.originalUrl so that it can be used to rediect paths at run time
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

///////////////////////////////////         this middleware make sure that only those can delete listings who are the owner the that listings
module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!(listing.owner._id.equals(res.locals.currUser._id) && res.locals.currUser)) {
        req.flash("error", "Your are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }else{
        next();
    }
}

///////////////////////////////////         this middleware make sure that only those can delete reviews who are the author the that reviews
module.exports.isReviewAuthor =  async (req,res,next) =>{
    let {id , reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!(res.locals.currUser._id.equals(review.author._id))){
        req.flash("error" , "you have not created this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


////////////////////////////////////            middleware to check the  server side validation of schema for listing  


module.exports.check_ServerSide_Validation = (req, res, next) => {                   //  function to check the server side validaton

    let { error } = listingSchema.validate(req.body);
    console.log(error);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
}


////////////////////////////////////            middleware to check the  server side validation of schema for reviews  



module.exports.check_ServerSide_review_Validation = async (req, res, next) => {       // functon to validate the reviewscfrom server side
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    }
    else {
        next();
    }
}