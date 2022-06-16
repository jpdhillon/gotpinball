const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RegionSchema = new Schema ({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lon: {
    type: Number,
    required: true
  }
});


module.exports = mongoose.model('Region', RegionSchema);