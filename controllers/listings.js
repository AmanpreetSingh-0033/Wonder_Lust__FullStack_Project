const Listing = require("../models/listing.js");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });


module.exports.index = async (req, res) => {                       //  route to show all listings
    let listings = await Listing.find();
    res.render("listings/index", { listings });
}

module.exports.renderNewForm = (req, res) => {                   // render form to add new listing
    res.render("listings/new");
}


module.exports.createListing = async (req, res, next) => {

    const response = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        })
        .send();

    if (!req.body.listing) {
        throw new ExpressError(400, "Enter the valid data for listing");
    }
    // Destructure the form data
    let { listing } = req.body;

    // Make sure category is an array even if user selects only one
    if (!Array.isArray(listing.category)) {
        listing.category = [listing.category];
    }
    // Create new listing with all form fields
    let newListing = new Listing(listing);
    newListing.owner = req.user._id;
    // Image from multer (Cloudinary)
    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    newListing.geometry = response.body.features[0].geometry;
    let result = await newListing.save();
    console.log(result);
    req.flash("success", "New listing created :)");
    console.log("✅ New Listing Created");
    res.redirect("/listings");
};



module.exports.showListing = async (req, res) => {                //   route to show details about specific listing
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");

    if (!listing) {
        req.flash("error", "Listing you are looking for, does not exist");
        throw new ExpressError(404, "Listing you are looking for, does not exist")
    }
    console.log(listing);
    res.render("listings/show", { listing });
}

module.exports.renderEditForm = async (req, res) => {                   //  render the edit form
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you are looking for, does not exist")
        throw new ExpressError(400, "Listing you are looking for, does not exist");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/c_fill,h_400,w_400");

    res.render("listings/edit", { listing, originalImageUrl });
    
}


module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Enter valid data");
    }
    const { id } = req.params;
    // Ensure category is always an array
    if (!Array.isArray(req.body.listing.category)) {
        if (req.body.listing.category) {
            req.body.listing.category = [req.body.listing.category];
        } else {
            req.body.listing.category = [];
        }
    }
    const listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { runValidators: true, new: true }
    );
    // ✅ Only update image if a file was uploaded
    if (req.file) {
        const { path: url, filename } = req.file;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing updated successfully :)");
    console.log("Listing updated successfully");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;                                                            //  destroy route - to delete the listing      
    await Listing.findByIdAndDelete({ _id: id });

    req.flash("success", "Listing deleted successfuly :)");
    console.log("Listing deleted successfuly :)");
    res.redirect(`/listings`);
}