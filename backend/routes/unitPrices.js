const router = require("express").Router();
const UnitPrice = require("../models/UnitPrice");

// Set or Update Unit Price for Grade "A"
router.post("/set-unit-price", async (req, res) => {
    const { vegType, gradeA } = req.body;

    // Calculate prices for grades B and C
    const gradeB = gradeA - (gradeA * 0.1); // 10% less than A
    const gradeC = gradeA - (gradeA * 0.2); // 20% less than A

    try {
        let unitPrice = await UnitPrice.findOne({ vegType });

        if (unitPrice) {
            // Update existing unit price
            unitPrice.gradeA = gradeA;
            unitPrice.gradeB = gradeB;
            unitPrice.gradeC = gradeC;
            await unitPrice.save();
        } else {
            // Create new unit price
            unitPrice = new UnitPrice({ vegType, gradeA, gradeB, gradeC });
            await unitPrice.save();
        }

        res.status(200).send({ status: "Unit Price Set/Updated", unitPrice });
    } catch (err) {
        res.status(500).send({ status: "Error setting unit price", error: err.message });
    }
});

// Get Unit Prices
router.get("/get-unit-prices", async (req, res) => {
    try {
        const unitPrices = await UnitPrice.find();
        res.status(200).send({ status: "Unit Prices Fetched", unitPrices });
    } catch (err) {
        res.status(500).send({ status: "Error fetching unit prices", error: err.message });
    }
});

module.exports = router;
