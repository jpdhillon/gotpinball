const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema ({
  locationId: Number,
  body: String,
  rating: Number
});

module.exports = mongoose.model("Review", reviewSchema);