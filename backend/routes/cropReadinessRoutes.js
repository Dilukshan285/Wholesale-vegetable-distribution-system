const express = require('express');
const router = express.Router();
const multer = require('multer');
const CropReadiness = require('../models/CropReadiness');
const authenticateFarmer = require("../middleware/authenticateFarmer");

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Adjust this path according to your folder structure
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

// Add file filter to restrict uploads to certain file types (e.g., images and pdfs)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'));
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

// @route   POST /cropReadiness/notify
// @desc    Create a new crop readiness notification
// @access  Protected
router.post('/notify', authenticateFarmer, upload.array('attachments', 10), async (req, res) => {
    try {
        const { farmerNIC, cropVariety, quantity, expectedQuality, preferredPickupDate, preferredPickupTime } = req.body;
        const attachments = req.files ? req.files.map(file => file.filename) : [];
        
        // Create new notification
        const newNotification = new CropReadiness({
            farmerNIC,
            cropVariety,
            quantity,
            expectedQuality,
            preferredPickupDate,
            preferredPickupTime,
            attachments
        });

        // Save notification to database
        await newNotification.save();
        res.status(201).json({ msg: 'Notification created successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Route to get all crop readiness notifications (no authorization required)
router.get('/all-notifications', async (req, res) => {
    try {
        const notifications = await CropReadiness.find(); // Fetch all notifications from the database
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch crop readiness notifications' });
    }
});

// Route to update the status of a specific crop readiness notification
router.put('/update-status/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        // Find the notification by ID and update the status
        const updatedNotification = await CropReadiness.findByIdAndUpdate(
            id,
            { status: status }, // Update the status field
            { new: true } // Return the updated document
        );

        if (!updatedNotification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.status(200).json(updatedNotification);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update notification status' });
    }
});

// @route   GET /cropReadiness/notifications
// @desc    Get all notifications for the authenticated farmer
// @access  Protected
router.get('/notifications', authenticateFarmer, async (req, res) => {
    console.log("Authenticated Farmer NIC:", req.user.nic);
    try {
        const farmerNIC = req.user.nic; // Get NIC from authenticated user
        const notifications = await CropReadiness.find({ farmerNIC });
        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   PUT /cropReadiness/:id
// @desc    Update a crop readiness notification
// @access  Protected
router.put('/:id', authenticateFarmer, upload.array('attachments', 10), async (req, res) => {
    try {
        const { cropVariety, quantity, expectedQuality, preferredPickupDate, preferredPickupTime } = req.body;
        const attachments = req.files ? req.files.map(file => file.filename) : [];

        // Update the notification with new data, including attachments
        const updatedNotification = await CropReadiness.findByIdAndUpdate(
            req.params.id,
            {
                cropVariety,
                quantity,
                expectedQuality,
                preferredPickupDate,
                preferredPickupTime,
                $push: { attachments: { $each: attachments } } // Add new attachments
            },
            { new: true }
        );

        if (!updatedNotification) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        res.status(200).json({ msg: 'Notification updated successfully!', updatedNotification });
    } catch (error) {
        console.error("Error updating notification:", error);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
});


// @route   DELETE /cropReadiness/:id
// @desc    Delete a crop readiness notification
// @access  Protected
router.delete('/:id', authenticateFarmer, async (req, res) => {
    try {
        const notification = await CropReadiness.findByIdAndDelete(req.params.id);

        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        res.status(200).json({ msg: 'Notification deleted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   GET /cropReadiness/:id
// @desc    Get a specific crop readiness notification by ID
// @access  Protected
router.get('/:id', authenticateFarmer, async (req, res) => {
    try {
        const notification = await CropReadiness.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        res.status(200).json(notification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
});




router.get('/api/crop-readiness/count', async (req, res) => {
    try {
      const totalCropReadinessCount = await CropReadiness.countDocuments();
      const pendingCount = await CropReadiness.countDocuments({ status: 'Pending' });
      const inProgressCount = await CropReadiness.countDocuments({ status: 'In Progress' });
      const completedCount = await CropReadiness.countDocuments({ status: 'Completed' });
  
      res.json({
        count: totalCropReadinessCount,
        statusCounts: {
          Pending: pendingCount,
          InProgress: inProgressCount,
          Completed: completedCount
        }
      });
    } catch (error) {
      console.error('Error fetching crop readiness count:', error);
      res.status(500).json({ error: 'Failed to fetch crop readiness count' });
    }
  });

  

module.exports = router;
