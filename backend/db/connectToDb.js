const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connectToMongoDB = async () => {
  try {
    console.log(process.env.MONGO_DB_URL);
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("Connected to mongodb");
  } catch (error) {
    console.log("Errow while connecting to MONGODB : " + error.message);
  }
};
module.exports = {
  connectToMongoDB,
};
