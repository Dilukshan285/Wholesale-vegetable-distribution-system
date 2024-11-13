const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const qaRecordSchema = new Schema({
    vegetableType: {
        type: String,
        required: true,
        enum: ["Carrot", "Leek", "Cabbage", "Potato"]
    },
    gradeAWeight: {
        type: Number,
        required: true,
        min: [0, 'Weight must be a positive number']
    },
    gradeBWeight: {
        type: Number,
        required: true,
        min: [0, 'Weight must be a positive number']
    },
    gradeCWeight: {
        type: Number,
        required: true,
        min: [0, 'Weight must be a positive number']
    },
    totalWeight: {
        type: Number,
        required: true,
        min: [0, 'Total weight must be a positive number']
    },
    wastedWeight: {
        type: Number,
        min: [0, 'Wasted weight must be a positive number']
    },
    batchId: {
        type: Schema.Types.ObjectId,
        ref: 'IncomingBatch',
        required: true
    },
    ID: {
        type: String,
        unique: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

// Counter schema to store the last number for each vegetable type
const counterSchema = new Schema({
    vegetableType: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 }
});

const Counter = mongoose.model("Counter", counterSchema);

// Pre-save hook to generate the custom ID and calculate wasted weight
qaRecordSchema.pre("save", async function(next) {
    const doc = this;

    try {
        // Calculate wasted weight before saving
        doc.wastedWeight = doc.totalWeight - (doc.gradeAWeight + doc.gradeBWeight + doc.gradeCWeight);

        // Find the counter for the specific vegetable type
        const counter = await Counter.findOneAndUpdate(
            { vegetableType: doc.vegetableType },
            { $inc: { seq: 1 } },
            { new: true, upsert: true } // Create if not found
        );

        let prefix = "";
        switch (doc.vegetableType) {
            case "Carrot":
                prefix = "CRT";
                break;
            case "Leek":
                prefix = "LKS";
                break;
            case "Cabbage":
                prefix = "CBG";
                break;
            case "Potato":
                prefix = "PTO";
                break;
        }

        // Generate the ID based on the sequence number
        doc.ID = `${prefix}${String(counter.seq).padStart(4, '0')}`;
        
        next();
    } catch (err) {
        next(err);
    }
});

const QARecord = mongoose.model("QARecord", qaRecordSchema);

module.exports = QARecord;
