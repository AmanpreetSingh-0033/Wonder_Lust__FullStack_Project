const mongoose = require("mongoose"); // Require Mongoose for database
const initData = require("./data.js"); // Import seed data
const Listing = require("../models/listing.js"); // Import Mongoose model

// Connect to MongoDB
async function main() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/Wander-Lust");
        console.log("✅ Connection to database successful");
    } catch (err) {
        console.error("❌ Database connection error:", err);
    }
}

main();

// Seed the database
const initDb = async () => {
    try {
        await Listing.deleteMany({});
        initData.data = initData.data.map((obj) => ({
            ...obj,
            owner: "684ad55410730af350a8b5ee" // Add default owner
        }));

        await Listing.insertMany(initData.data); // ← UNCOMMENT THIS LINE to insert data
        console.log("✅ Database initialized with listings");
    } catch (err) {
        console.error("❌ Error initializing database:", err);
    }
};

initDb();
