// routes/customerRequestRoutes.js
const express = require("express");
const {
    addCustomerRequest,
    getCustomerRequests,
    updateCustomerRequest,
    deleteCustomerRequest
} = require("../controller/customerRequestController.js");

const router = express.Router();

// Define routes and attach controller functions
router.post('/customerRequest', addCustomerRequest);
router.get('/customerRequest', getCustomerRequests);
router.put('/customerRequest/:id', updateCustomerRequest);
router.delete('/customerRequest/:id', deleteCustomerRequest);

module.exports = router;  // Use module.exports instead of export default
