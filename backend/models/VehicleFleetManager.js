const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fleetManagerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    nic: {
        type: String,
        required: true,
        unique: true
    },
    mobileNo: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    }
});

const VehicleFleetManager = mongoose.model('VehicleFleetManager', fleetManagerSchema);

module.exports = VehicleFleetManager;