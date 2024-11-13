const router = require('express').Router();
const FuelEfficiency = require('../models/FuelEfficiency');

// Route to retrieve fuel efficiency data for a specific vehicle, year, and month using POST method
router.post('/', async (req, res) => {
    console.log("Request body:", req.body);
    const { registerNo, year, month } = req.body;

    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const records = await FuelEfficiency.find({
            registerNo,
            date: { $gte: startDate, $lte: endDate }
        });

        if (records.length === 0) {
            return res.status(404).json({ message: "No records found for the specified month." });
        }

        const totalFuelEfficiency = records.reduce((acc, record) => acc + record.fuelEfficiency, 0) / records.length;
        const totalCostPerLiter = records.reduce((acc, record) => acc + record.costPerLiter, 0) / records.length;
        const totalCostPerKilometer = records.reduce((acc, record) => acc + record.costPerKilometer, 0) / records.length;

        res.json({
            registerNo,
            year,
            month,
            totalFuelEfficiency,
            totalCostPerLiter,
            totalCostPerKilometer
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "Error retrieving fuel efficiency data" });
    }
});

module.exports = router;
