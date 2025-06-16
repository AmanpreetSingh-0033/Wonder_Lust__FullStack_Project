const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    comment : {
        type : String,
    },
    rating : {
        type : Number , 
        min : 0 , 
        max : 5
    },
    created_At : {
        type : Date,
        default : Date.now()
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    }
});

const Review = new mongoose.model("Review" , reviewSchema);

module.exports = Review ; 