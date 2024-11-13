const express = require("express");
const router = express.Router();
const PickupRequest = require("../models/PickupRequest");
const authenticateFarmer = require("../middleware/authenticateFarmer")
const Farmer = require("../models/farmers");

const nodemailer = require('nodemailer');

// Create a new pickup request
router.post("/add", async (req, res) => {
  const {
    cropTypes,
    quantities,
    preferredDate,
    preferredTime,
    address,
    location,
    NIC,
  } = req.body;


  console.log("Request Body:", req.body);

  try {
    // Map cropTypes and quantities into the crops array as required by the schema
    const crops = cropTypes.map((cropType, index) => ({
      cropType: cropType,
      quantity: quantities[index], // Pair crop type with its corresponding quantity
    }));

    const newPickupRequest = new PickupRequest({
      NIC,
      crops, // Set the crops array
      preferredDate,
      preferredTime,
      address,
      location,
    });

    const savedRequest = await newPickupRequest.save();
    res
      .status(201)
      .json({ message: "Pickup request added successfully", savedRequest });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding pickup request", error: error.message });
  }
});

// Get all pickup requests for the authenticated farmer
// Fetch pickup requests for the authenticated farmer based on NIC
router.get("/pickupRequests", authenticateFarmer, async (req, res) => {
  try {
    const farmerNIC = req.user.nic; // Get NIC from the authenticated farmer's token (req.user)

    // Find pickup requests that match the farmer's NIC
    const pickupRequests = await PickupRequest.find({ NIC: farmerNIC });

    if (!pickupRequests || pickupRequests.length === 0) {
      return res.status(404).json({ message: "No pickup requests found for this farmer" });
    }

    res.status(200).json(pickupRequests);
  } catch (error) {
    console.error("Error fetching pickup requests:", error);
    res.status(500).json({ message: "Server error fetching pickup requests" });
  }
});



// Fetch all pickup requests for admins
router.get('/all-pickup-requests', async (req, res) => {
  try {
    const pickupRequests = await PickupRequest.find();
    res.json(pickupRequests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load pickup requests.' });
  }
});

// Update status of a pickup request
// Update status of a pickup request and send email
router.put('/update-status/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const request = await PickupRequest.findByIdAndUpdate(id, { status }, { new: true });

    if (!request) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }

    // Fetch farmer's email using NIC
    const farmer = await Farmer.findOne({ NIC: request.NIC });
    if (farmer) {
      const mailOptions = {
        from: 'gsptaders29@gmail.com',
        to: farmer.email,
        subject: 'Pickup Request Status Update',
        html: `
          <div style="background-color: #f0f0f0; padding: 10px; text-align: right;">
            
            <div style="color: #11532F; font-family: Helvetica, Arial, sans-serif;">
              <h2 style="margin: 0;">GSP Traders Pvt Ltd</h2>
              <p style="margin: 0;">A12, Dedicated Economic Centre, Nuwara Eliya, Sri Lanka</p>
              <p style="margin: 0;">Email: gsptraders29@gmail.com | Phone: +94 77 7144 133</p>
            </div>
          </div>
          <hr style="border-color: #11532F; margin: 20px 0;" />
          <p>Hello ${farmer.firstName},</p>
          <p>Your pickup request has been updated to: ${status}.</p>
          <ul>
      ${request.crops.map(crop => `<li><strong>${crop.cropType}</strong>: ${crop.quantity} kg</li>`).join('')}
    </ul>
    
    <p><strong>Preferred Date:</strong> ${request.preferredDate}</p>
    <p><strong>Preferred Time:</strong> ${request.preferredTime}</p>
    <p>Thank you for choosing <strong>GSP Traders Pvt Ltd</strong>.</p>
          <p>Thank you,<br>GSP Traders Pvt Ltd</p>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Email sending failed:', error);
          return res.status(500).json({ message: 'Failed to send email', error: error.message });
        } else {
          console.log('Email sent info:', info); // Log the response for details
          return res.status(200).json({ message: 'Pickup request status updated and email sent', request });
        }
      });
    }

    res.status(200).json(request);
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Failed to update pickup request status' });
  }
});


// Get a single pickup request by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pickupRequest = await PickupRequest.findById(id);
    if (!pickupRequest) {
      return res.status(404).json({ message: "Pickup request not found" });
    }
    res.status(200).json(pickupRequest);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving pickup request",
        error: error.message,
      });
  }
});

// Update a pickup request by ID
router.put("/:id", async (req, res) => {
  const {
    NIC,
    preferredDate,
    preferredTime,
    address,
    status,
    crops,
    location,
  } = req.body;

  // Ensure all required fields are present
  if (
    !NIC ||
    !preferredDate ||
    !preferredTime ||
    !address ||
    !location ||
    !location.lat ||
    !location.lng
  ) {
    return res.status(400).json({
      message: "Error updating pickup request",
      error:
        "NIC, preferredDate, preferredTime, address, location.lat, and location.lng are required.",
    });
  }

  try {
    // Update the request and return the modified document
    const updatedRequest = await PickupRequest.findByIdAndUpdate(
      req.params.id,
      {
        NIC,
        preferredDate,
        preferredTime,
        address,
        status,
        crops, // Ensure crops array is passed for update
        location,
      },
      { new: true, runValidators: true } // Run validators and return the updated document
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Pickup request not found" });
    }

    res.json({
      message: "Pickup request updated successfully",
      updatedRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating pickup request",
      error: error.message,
    });
  }
});

// Delete a pickup request by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRequest = await PickupRequest.findByIdAndDelete(id);
    if (!deletedRequest) {
      return res.status(404).json({ message: "Pickup request not found" });
    }
    res
      .status(200)
      .json({ message: "Pickup request deleted successfully", deletedRequest });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting pickup request", error: error.message });
  }
});

router.get('/api/pickup-requests/count', async (req, res) => {
  try {
    const pickupRequestCount = await PickupRequest.countDocuments();
    res.json({ count: pickupRequestCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get pickup request count' });
  }
});

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gsptaders29@gmail.com', // Replace with your Gmail address
    pass: 'aotfbsakvqnnaowh',  // Replace with your Gmail App password
  },
});








module.exports = router;
