const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = mongoose.Schema({
    email : {
        type : String , 
        require : true
    }
});
////      passportLocalMongoose automatically create username and password field for out model ..... we don't need to initilize username and password here 



// passport-local-mongoose is a Mongoose plugin that simplifies building username/password login with Passport.
// When you add it using .plugin(), it modifies your schema

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User" , userSchema);