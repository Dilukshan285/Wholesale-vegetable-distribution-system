const mongoose = require('mongoose');

const PickupRequestSchema = new mongoose.Schema({
  pickupRequestID: {
    type: String,
    unique: true, // Ensures uniqueness
    default: () => `PR-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, // Generate unique ID
  },
  NIC: {
    type: String,
    required: true,
  },
  crops: [
    {
      cropType: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  preferredDate: {
    type: Date,
    required: true,
  },
  preferredTime: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  weather: {
    temp: { type: Number },
    feels_like: { type: Number },
    wind_speed: { type: Number },
    humidity: { type: Number },
    pressure: { type: Number },
    description: { type: String },
    city: { type: String },
  },
  status: {
    type: String,
    default: 'Pending',
  },
});


module.exports = mongoose.model('PickupRequest', PickupRequestSchema);
