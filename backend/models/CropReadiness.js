// models/CropReadiness.js
const mongoose = require('mongoose');

const cropReadinessSchema = new mongoose.Schema({
    farmerNIC: { type: String, required: true },
    cropVariety: { type: String, required: true },
    quantity: { type: Number, required: true },
    expectedQuality: { type: String, required: true },
    preferredPickupDate: { type: Date, required: true },
    preferredPickupTime: { type: String, required: true },
    attachments: [{ type: String }], // URLs of uploaded files
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CropReadiness', cropReadinessSchema);
