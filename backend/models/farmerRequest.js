// models/farmerRequest.js
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const farmerRequestSchema = new Schema({
    location: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    vehicleOption: {
        type: String,
        enum: ['Farmer Vehicle', 'Company Vehicle'],
        required: true,
    }
});

const FarmerRequest = model('FarmerRequest', farmerRequestSchema);

module.exports = FarmerRequest;
