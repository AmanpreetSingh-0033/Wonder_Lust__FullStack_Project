
const express = require("express");                           //  express
const router = express.Router({mergeParams : true});
const Listing = require("../models/listing.js");              // require Listing model
const Review = require("../models/review.js");                // require review model
const { reviewSchema } = require("../schema.js");             // require server side lisitng schema for validation                        
const wrapAsync = require("../utils/wrapAsync.js");                          //  for handle async errors
const Joi = require("joi");
const {isLoggedIn , isReviewAuthor , check_ServerSide_review_Validation} = require("../middlewares.js");
const ExpressError = require("../utils/ExpressError.js");                    //  for custom error handling

const reviewController =  require("../controllers/reviews.js");

router.get("/" , (req,res)=>{
    req.flash("success" , "Now , you can add your review");
    let { id } = req.params;
    res.redirect(`/listings/${id}`);
})


///// route to create review
router.post("/", check_ServerSide_review_Validation , isLoggedIn ,  wrapAsync(reviewController.createReview));



// if review delete then it will delete from review model and listing model as well   ,    but not delete from review model when we delete listing -> so for this facility we need to create a middleware which will triger when we delete any listing  ,  reviews belongs to that listing will also get deleted


router.get("/:reviewId" , (req,res)=>{
   
    let {id , reviewId} = req.params;
    req.flash("success" , "Now you can delete your reviews");
    res.redirect(`/listings/${id}`);
})


router.delete("/:reviewId", isLoggedIn , isReviewAuthor , wrapAsync(reviewController.destroyReview));


module.exports = router;