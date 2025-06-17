
const express = require("express");                                        //  express
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");                             // require Listing model
const Review = require("../models/review.js");                              // require review model
const { listingSchema, reviewSchema } = require("../schema.js");            // require server side lisitng schema for validation                        

const wrapAsync = require("../utils/wrapAsync.js");                          //  for handle async errors
const ExpressError = require("../utils/ExpressError.js");                    //  for custom error handling
const Joi = require("joi");

const { isLoggedIn, isOwner, check_ServerSide_Validation } = require("../middlewares.js");

const listingController = require("../controllers/listings.js");

const multer = require('multer');
const storage = require("../cloudCongig.js");
const upload = multer(storage);



//////////////////////////////////////////              routes 

router.route("/")
    .get(wrapAsync(listingController.index))                                                     // route to ahow all listings
    .post(isLoggedIn, check_ServerSide_Validation, upload.single('listing[image]'), wrapAsync(listingController.createListing));  // adding listing into database




router.get("/aboutUs", (req, res) => {
    res.render("listings/about.ejs");
})


router.get("/new", isLoggedIn, listingController.renderNewForm)                   // render form to add new listing


// Route to filter listings by category
router.get("/filters", async (req, res) => {
    try {
        const { category } = req.query;
        if (!category) {
            req.flash("error", "No category selected.");
            return res.redirect("/listings");
        }
        // Find listings where category array includes the requested category
        const filteredListings = await Listing.find({ category: category });

        res.render("listings/filterListings.ejs", {
            listings: filteredListings,
            category
        });
    } catch (err) {
        console.error("Error fetching filtered listings:", err);
        req.flash("error", "Something went wrong while filtering listings.");
        res.redirect("/listings");
    }
});


router.get("/myListings", isLoggedIn, wrapAsync(async (req, res) => {
    let userId = req.user._id;
    let listings = await Listing.find({ owner: userId });

    res.render("listings/myListings", { listings });
}));

////////////////           route to show the listing to be searched

router.get("/search", async (req, res) => {
    const query = req.query.q?.trim() || "";
    const regex = new RegExp(escapeRegex(query), "i"); // case-insensitive text match
    const numericQuery = Number(query); // convert query to number

    // Build search conditions
    let searchConditions = [
        { title: regex },
        { description: regex },
        { location: regex },
        { country: regex }
    ];
    // If query is a valid number, also include price search
    if (!isNaN(numericQuery)) {
        searchConditions.push({ price: numericQuery });
    }
    // Perform search
    const listings = await Listing.find({ $or: searchConditions });
    // Render the search results page
    res.render("listings/search.ejs", { listings, query });
});

// Utility to escape regex special characters
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}




router.route("/:id")
    .get(wrapAsync(listingController.showListing))          //   route to show details about specific listing
    .put(isLoggedIn, isOwner, check_ServerSide_Validation, upload.single('listing[image]'), wrapAsync(listingController.updateListing))//update the listing 
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));     //  destroy route - to delete the listing  

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));  //  render the edit form



/* 

the facility is that .....when i add listing and add reviews ...it shores the id of the reviews and when i delete listing .......that reviews also get delete which are in its review array ...also that listing get deleted form db.listings.find({}) and db.reviews.find({}) , and on the ither hand when i delete any specific review ..... it get delete from show.ejs and also from that perticular listing's array ...also in data base ...... when db.listings.find({ // some condition   }) , review deleted from listing review array and also that review get deleted from db.reviews.....     now i face the problem is that ..... when i run db.review.deleteMany({}) in terminal ....all the reviews get deleted from review collection and also disappear from listing show.ejs .... for all listings ...... but when i run db.listing.find({some condition})..... even though in show.ejs this listing don't show any review ....but in its reviews array .... it shores the reviews reference id till yet 

-------------       To fix this error   -------------------

*/

router.get("/cleanup/reviews", async (req, res) => {
    const validReviewIds = await Review.distinct("_id");
    await Listing.updateMany(
        {},
        { $pull: { reviews: { $nin: validReviewIds } } }
    );
    req.flash("success", "Cleaned up stale review references!");
    res.redirect("/listings");
});



module.exports = router