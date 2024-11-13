const router = require("express").Router();
const Land = require("../models/land");
const Farmer = require("../models/farmers");
const authenticateFarmer = require("../middleware/authenticateFarmer"); // Middleware for farmer authentication


router.post('/add', authenticateFarmer, async (req, res) => {
  try {
    const { landSize, soilType, cropsGrown, location, address } = req.body;

    // Ensure all required fields are provided
    if (!landSize || !soilType || !cropsGrown || !location || !location.lat || !location.lng || !address) {
      return res.status(400).json({ error: 'Please fill in all required fields' });
    }

    // Get the farmerId from the token
    const farmerId = req.user.id;

    const newLand = new Land({
      farmerId,  // Automatically associate this land with the farmer
      landSize,
      soilType,
      cropsGrown,
      coordinates: location,  // Extract lat/lng from location
      address,
    });

    // Save the land to the database
    await newLand.save();

    res.status(201).json({ message: 'Land added successfully' });
  } catch (err) {
    console.error('Error adding land:', err);  // Log full error details for debugging
    res.status(500).json({ error: 'Error adding land' });
  }
});


// Get all lands
router.route("/all").get(async (req, res) => {
  try {
    const lands = await Land.find().populate('farmerId', 'firstName lastName NIC');
    res.status(200).json(lands);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch lands", message: err.message });
  }
});

// Get land by ID
router.route("/get/:id").get(async (req, res) => {
  try {
    const land = await Land.findById(req.params.id).populate('farmerId', 'firstName lastName NIC');
    if (!land) {
      return res.status(404).json({ error: "Land not found" });
    }
    res.status(200).json(land);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch land", message: err.message });
  }
});

// Update land by ID
router.route("/update/:id").put(authenticateFarmer, async (req, res) => {
  try {
    const { landSize, address, coordinates, soilType, cropsGrown } = req.body;
    const updatedLandData = { landSize, address, coordinates, soilType, cropsGrown };

    const updatedLand = await Land.findByIdAndUpdate(req.params.id, updatedLandData, { new: true });
    if (!updatedLand) {
      return res.status(404).json({ error: "Land not found" });
    }

    res.status(200).json({ message: "Land updated successfully", land: updatedLand });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to update land", message: err.message });
  }
});

// Delete land by ID
router.route("/delete/:id").delete(authenticateFarmer, async (req, res) => {
  try {
    const deletedLand = await Land.findByIdAndDelete(req.params.id);
    if (!deletedLand) {
      return res.status(404).json({ error: "Land not found" });
    }

    res.status(200).json({ message: "Land deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to delete land", message: err.message });
  }
});

module.exports = router;
