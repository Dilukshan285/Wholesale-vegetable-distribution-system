const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const incomingBatchSchema = new Schema({
    vegetableType: {
        type: String,
        required: true,
        enum: ["Carrot", "Leek", "Cabbage", "Potato"] // Add more types if needed
    },
    totalWeight: {
        type: Number,
        required: true,
        min: [0, 'Weight must be a positive number'] // Ensure non-negative weight
    },
    arrivalDate: {
        type: Date,
        required: true,
        default: Date.now // Automatically sets the arrival date to current date and time
    }
});

const IncomingBatch = mongoose.model("IncomingBatch", incomingBatchSchema);

module.exports = IncomingBatch;
