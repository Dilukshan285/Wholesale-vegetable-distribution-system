const router = require("express").Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let Farmer = require("../models/farmers");
const authenticateFarmer = require("../middleware/authenticateFarmer");

// Add a new farmer
router.route("/add").post(async (req, res) => {
  try {
    const { firstName, lastName, DOB, age, gender, NIC, address, email, contact, pwd: password } = req.body;

    // Input validation
    if (isNaN(age)) {
      return res.status(400).json({ error: "Invalid age value" });
    }

    if (isNaN(Date.parse(DOB))) {
      return res.status(400).json({ error: "Invalid date of birth" });
    }

   

    const newFarmer = new Farmer({
      firstName,
      lastName,
      DOB: new Date(DOB),
      age: Number(age),
      gender,
      NIC,
      address,
      email,
      contact,
      password,
    });

    await newFarmer.save();
    res.json("Farmer added");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to add farmer", message: err.message });
  }
});

router.get('/profile', authenticateFarmer, async (req, res) => {
  try {
      console.log("Authenticated farmer ID:", req.user.id);
      const farmer = await Farmer.findById(req.user.id); // Assuming Mongoose is used
      if (!farmer) {
          return res.status(404).json({ message: 'Farmer not found' });
      }
      res.json(farmer);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});

// Get all farmers
router.route("/all-farmers").get((req, res) => {
  Farmer.find()
    .then((farmers) => {
      res.json(farmers);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to fetch farmers", message: err.message });
    });
});

// Update a farmer by ID
router.route("/update/:id").put(async (req, res) => {
  let userId = req.params.id;
  const { firstName, lastName, DOB, age, gender, NIC, address, email, contact, password } = req.body;

  try {
    // Input validation
    if (isNaN(age)) {
      return res.status(400).json({ error: "Invalid age value" });
    }

    if (isNaN(Date.parse(DOB))) {
      return res.status(400).json({ error: "Invalid date of birth" });
    }

    let updatedFields = { firstName, lastName, DOB, age, gender, NIC, address, email, contact };

    

    const updatedFarmer = await Farmer.findByIdAndUpdate(userId, updatedFields, { new: true });

    if (!updatedFarmer) {
      return res.status(404).send({ status: "Farmer not found" });
    }

    res.status(200).send({ status: "Farmer updated", updatedFarmer });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "Error with updating data", error: err.message });
  }
});

// Delete a farmer by ID
router.route("/delete/:id").delete(async (req, res) => {
  let userId = req.params.id;

  try {
    const deletedFarmer = await Farmer.findByIdAndDelete(userId);

    if (!deletedFarmer) {
      return res.status(404).send({ status: "Farmer not found" });
    }

    res.status(200).send({ status: "Farmer deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: "Error with deleting farmer", error: err.message });
  }
});

// Get a farmer by ID
router.route("/get/:id").get(async (req, res) => {
  let userId = req.params.id;

  try {
    const farmer = await Farmer.findById(userId);

    if (!farmer) {
      return res.status(404).send({ status: "Farmer not found" });
    }

    res.status(200).send({ status: "Farmer fetched", farmer });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: "Error with fetching farmer", error: err.message });
  }
});

// Farmer login route (path updated to /login_farmer)
router.post("/login_farmer", async (req, res) => {
  const { email, password } = req.body;

  try {
      // Find farmer by email
      const farmer = await Farmer.findOne({ email });
      if (!farmer || farmer.password !== password) {
          return res.status(400).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign({ farmerId: farmer._id, nic: farmer.NIC}, process.env.FARMER_JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
      
  } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
  }
});


router.get('/api/farmers/count', async (req, res) => {
  try {
    const farmerCount = await Farmer.countDocuments();
    res.json({ count: farmerCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get farmer count' });
  }
});



module.exports = router;
