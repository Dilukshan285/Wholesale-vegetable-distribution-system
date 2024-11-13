// models/land.js
const mongoose = require("mongoose");

const landSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  landSize: {
    type: Number, // size in acres or hectares
    required: true
  },
  address: {
    type: String,
    required: true
  },
  coordinates: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  soilType: {
    type: String,
    required: true
  },
  cropsGrown: {
    type: [String], // Array of crops
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Land", landSchema);
