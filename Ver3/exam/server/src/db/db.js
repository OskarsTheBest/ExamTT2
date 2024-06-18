const mongoose = require('mongoose');
require('dotenv').config();

const DB_URL = process.env.DB_URL || "mongodb+srv://oskarskipens2:IKyBTwavCadVryss@exam.hgnnte2.mongodb.net/";

module.exports = () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    mongoose.connect(DB_URL, connectionParams)
    console.log("Connected to MongoDB")
  } catch (error) {
    console.log(error);
    console.log("could not connect to database")
  }
}
