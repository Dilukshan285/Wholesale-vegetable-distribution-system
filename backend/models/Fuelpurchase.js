const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fuelpurchaseSchema = new Schema({
    driverNic: {
        type: String,
        required: true,
    },
    registerNo: {
        type: String,
        required: true,
    },
    mileage: {
        type: Number,
        required: true
    },
    liters: {
        type: Number,
        required: true
    },
    cost: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Fuelpurchase = mongoose.model('Fuelpurchase', fuelpurchaseSchema);

module.exports = Fuelpurchase;