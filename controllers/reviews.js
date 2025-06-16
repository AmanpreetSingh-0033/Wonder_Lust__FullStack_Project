const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.createReview = async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);        //  add new review in Review Model
    newReview.author = res.locals.currUser._id;

    listing.reviews.push(newReview);                    //  also add new review in that specific listing

    await newReview.save();
    await listing.save();

    req.flash("success" , "Thanks for adding the review :)");
    console.log(req.flash("Review added ! "));

    res.redirect(`/listings/${listing._id}`);
}


module.exports.destroyReview = async (req, res) => {                //  route to destroy the review
    let { id, reviewId } = req.params;
    
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success" , "Review deleted successfully :)");
    console.log("Review deleted successfully");

    res.redirect(`/listings/${id}`);
}