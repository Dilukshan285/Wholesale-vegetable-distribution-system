// controllers/customerRequestController.js
const CustomerRequest = require("../models/customerRequest.js");

// Add a new customer request
const addCustomerRequest = async (req, res) => {
    const { pickupLocation, pickupDate, pickupTime, selectedVehicle } = req.body;
    try {
        const newCustomerRequest = new CustomerRequest({ pickupLocation, pickupDate, pickupTime, selectedVehicle });
        await newCustomerRequest.save();
        res.status(201).json(newCustomerRequest);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// Get all customer requests
const getCustomerRequests = async (req, res) => {
    try {
        const customerRequests = await CustomerRequest.find();
        res.json(customerRequests);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// Update a customer request
const updateCustomerRequest = async (req, res) => {
    const { pickupLocation, pickupDate, pickupTime, selectedVehicle } = req.body;
    const id = req.params.id;
    try {
        const updatedCustomerRequest = await CustomerRequest.findByIdAndUpdate(
            id,
            { pickupLocation, pickupDate, pickupTime, selectedVehicle },
            { new: true }
        );

        if (!updatedCustomerRequest) {
            return res.status(404).json({ message: "Customer request not found" });
        }
        res.json(updatedCustomerRequest);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// Delete a customer request
const deleteCustomerRequest = async (req, res) => {
    const id = req.params.id;
    try {
        await CustomerRequest.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addCustomerRequest,
    getCustomerRequests,
    updateCustomerRequest,
    deleteCustomerRequest
};
