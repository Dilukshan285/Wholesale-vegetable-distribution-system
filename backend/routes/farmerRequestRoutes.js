// routes/farmerRequestRoutes.js
const express = require("express");
const {
    addFarmerRequest,
    getFarmerRequests,
    updateFarmerRequest,
    deleteFarmerRequest
} = require("../controller/farmerRequestController.js");

const router = express.Router();

// Routes
router.post('/farmerRequest', addFarmerRequest);
router.get('/farmerRequest', getFarmerRequests);
router.put('/farmerRequest/:id', updateFarmerRequest);
router.delete('/farmerRequest/:id', deleteFarmerRequest);

module.exports = router;
