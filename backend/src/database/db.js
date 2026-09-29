const mongoose = require("mongoose");

const connectDB = async () => {
  const url = process.env.MONGO_URI;
  try {
    const connection = await mongoose.connect(url);
  } catch (error) {
      throw new Error("Database connection failed");
  }
};

module.exports = connectDB;
