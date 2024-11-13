// controllers/farmerRequestController.js
const FarmerRequest = require("../models/farmerRequest.js");

const addFarmerRequest = async (req, res) => {
    const { location, date, time, vehicleOption } = req.body;
    try {
        const newFarmerRequest = new FarmerRequest({ location, date, time, vehicleOption });
        await newFarmerRequest.save();
        res.status(201).json(newFarmerRequest);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const getFarmerRequests = async (req, res) => {
    try {
        const farmerRequests = await FarmerRequest.find();
        res.json(farmerRequests);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const updateFarmerRequest = async (req, res) => {
    try {
        const { location, date, time, vehicleOption } = req.body;
        const id = req.params.id;
        const updatedFarmerRequest = await FarmerRequest.findByIdAndUpdate(
            id,
            { location, date, time, vehicleOption },
            { new: true }
        );

        if (!updatedFarmerRequest) {
            return res.status(404).json({ message: "Farmer request not found" });
        }
        res.json(updatedFarmerRequest);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const deleteFarmerRequest = async (req, res) => {
    try {
        const id = req.params.id;
        await FarmerRequest.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addFarmerRequest,
    getFarmerRequests,
    updateFarmerRequest,
    deleteFarmerRequest,
};
