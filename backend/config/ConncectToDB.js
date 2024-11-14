const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connceted to database");
  } catch (e) {
    console.log(e);
  }
}

module.exports = connectDB;
