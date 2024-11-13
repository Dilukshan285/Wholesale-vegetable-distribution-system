const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
    registrationNo: {
        type: String, // Use the built-in String type instead of 'string'
        required: true,
        unique: true
    },
    manufacYear: {
        type: Date, // Use the built-in Date type instead of 'date'
        required: true
    },
    mileage: {
        type: Number, // Use the built-in Number type instead of 'Number'
        required: true
    },
    length: {
        type: Number,
        required: true
    },
    width: {
        type: Number,
        required: true,
        validate: {
            validator: function(value) {
                // `this` refers to the current document being validated
                return value <= this.length;
            },
            message: 'Width cannot be more than the length'
        }
    },
    drivernic: {
        type: String // Use the built-in String type instead of 'string'
    }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
