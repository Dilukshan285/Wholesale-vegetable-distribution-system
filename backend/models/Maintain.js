const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const maintainSchema = new Schema({
    registerNo: {
        type: String,
        required: true,
    },
    currentMileage: {
        type: Number,
        required: true,
        
    },
    nextServiceMileage: {
        type: Number,
        required: true
    },
    serviceDate: {
        type: Date,
        required: true
    },
    totalCost: {
        type: Number,
        required: true
    }
},{ timestamps: true });

const Maintain = mongoose.model('Maintain', maintainSchema);

module.exports = Maintain;