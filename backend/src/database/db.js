const mongoose = require("mongoose");

const connectDB = async () => {
  const url = process.env.MONGO_URI;
  try {
    const connection = await mongoose.connect(url);
    console.log("Database connection setup success");
  } catch (error) {
    console.log("Connection error in Database", error);
  }
};

module.exports = connectDB;
