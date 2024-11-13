const mongoose = require("mongoose");

const unitPriceSchema = new mongoose.Schema({
    vegType: {
        type: String,
        enum: ['Carrot', 'Leeks', 'Cabbage', 'Potato'],
        required: true
    },
    gradeA: {
        type: Number,
        required: true
    },
    gradeB: {
        type: Number,
        required: true
    },
    gradeC: {
        type: Number,
        required: true
    }
});

const UnitPrice = mongoose.model("UnitPrice", unitPriceSchema);
module.exports = UnitPrice;
