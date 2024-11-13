const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fuelEfficiencySchema = new Schema({
    registerNo: {
        type: String,
        required: true,
    },
    previousMileage: {
        type: Number,
        required: true,
    },
    currentMileage: {
        type: Number,
        required: true,
    },
    liters: {
        type: Number,
        required: true,
    },
    fuelEfficiency: {
        type: Number, // kilometers per liter
        required: true,
    },
    costPerLiter: {
        type: Number,
        required: true,
    },
    costPerKilometer: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const FuelEfficiency = mongoose.model('FuelEfficiency', fuelEfficiencySchema);
module.exports = FuelEfficiency;
