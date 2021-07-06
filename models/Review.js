const mongoose = require("mongoose");
const { Schema } = mongoose;
require('mongoose-long')(mongoose);

const reviewSchema = new Schema(
  {
    title: String,
    Running_time_int: Number,
    Release_date_datetime: String,
    Budget: String,
    imdb_rating: String,
    rotten_tomatoes: String
    
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);