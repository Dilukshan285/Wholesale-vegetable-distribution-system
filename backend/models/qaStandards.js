const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const qualityStandardSchema = new Schema({
    vegetableType: {
        type: String,
        required: true,
        enum: ["Carrot", "Leek", "Cabbage", "Potato"]
    },
    gradeA: {
        weight: {
            type: Number,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        shape: {
            type: String,
            required: true
        },
        damages: {
            type: String,
            required: true
        },
        blemishes: {
            type: String,
            required: true
        }
    },
    gradeB: {
        weight: {
            type: Number,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        shape: {
            type: String,
            required: true
        },
        damages: {
            type: String,
            required: true
        },
        blemishes: {
            type: String,
            required: true
        }
    },
    gradeC: {
        weight: {
            type: Number,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        shape: {
            type: String,
            required: true
        },
        damages: {
            type: String,
            required: true
        },
        blemishes: {
            type: String,
            required: true
        }
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const QualityStandard = mongoose.model("QualityStandard", qualityStandardSchema);

module.exports = QualityStandard;
