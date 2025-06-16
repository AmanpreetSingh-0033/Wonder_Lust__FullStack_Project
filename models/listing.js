const { ref, required } = require("joi");
const mongoose = require("mongoose");                            // reuire mongoose to for database
const Review = require("./review.js");


const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        url: String,
        filename: {
            type: String
        },
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    category: {
        type: [String],
        enum: ["Trending", "Rooms", "City", "Mountains", "Castels", "Pools", "Beaches", "Farms", "Arctic", "Boats", "Houses", "Hotels", "Kids", "Wonder Land", "Play Station", "Clubs"],
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});


//  middleware which trigeer when we delete our listing 
// function : delete all the reviews from Review model belongs to the deleted listing 

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        // console.log("I am post middleware");
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
    console.log("Associated reviews deleted.");
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;