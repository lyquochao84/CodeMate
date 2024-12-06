const mongoose = require("mongoose");

// Load .env file
const dotenv = require("dotenv");
dotenv.config();

const uri = process.env.MONGO_URI;

// Connect to MongoDB using Mongoose
async function connectDB() {
  try {
    // Connect MongoDB Cluster
    await mongoose.connect(uri);
    console.log("Successfully connected to MongoDB with Mongoose!");
  } 
  catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
}

module.exports = connectDB;
