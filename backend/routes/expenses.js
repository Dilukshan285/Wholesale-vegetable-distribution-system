const express = require('express');
const router = express.Router();
const Fuelpurchase = require('../models/Fuelpurchase'); // Import your Fuelpurchase model
const Maintain = require('../models/Maintain'); // Import your Maintain model

// Route for fetching fuel purchase records
router.get('/fuelpurchase', async (req, res) => {
    const { registerNo } = req.query;

    try {
        if (!registerNo) {
            return res.status(400).json({ message: "registerNo parameter is required" });
        }

        const fuelRecords = await Fuelpurchase.find({ registerNo });
        if (fuelRecords.length === 0) {
            return res.status(404).json({ message: "No fuel records found" });
        }
        res.json(fuelRecords);
    } catch (error) {
        console.error('Error fetching fuel purchase records:', error);
        res.status(500).json({ message: "Error fetching fuel purchase records" });
    }
});

// Route for fetching maintenance records
router.get('/maintain', async (req, res) => {
    const { registerNo } = req.query;

    try {
        if (!registerNo) {
            return res.status(400).json({ message: "registerNo parameter is required" });
        }

        const maintainRecords = await Maintain.find({ registerNo });
        if (maintainRecords.length === 0) {
            return res.status(404).json({ message: "No maintenance records found" });
        }
        res.json(maintainRecords);
    } catch (error) {
        console.error('Error fetching maintenance records:', error);
        res.status(500).json({ message: "Error fetching maintenance records" });
    }
});

module.exports = router;
