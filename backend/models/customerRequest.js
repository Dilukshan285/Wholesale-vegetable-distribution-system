// models/customerRequest.js
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Define the schema
const customerRequestSchema = new mongoose.Schema({
    pickupLocation: {
        type: String,
        required: true,
    },
    pickupDate: {
        type: Date,
        required: true,
    },
    pickupTime: {
        type: String,
        required: true,
    },
    selectedVehicle: {
        type: String,
        enum: ['Farmer Vehicle', 'Company Vehicle'],
        required: true,
    }
});

// Create and export the model
const CustomerRequest = mongoose.model('CustomerRequest', customerRequestSchema);

module.exports = CustomerRequest;
