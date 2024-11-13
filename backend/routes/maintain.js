const router = require('express').Router();
let Maintain = require('../models/Maintain');
const Vehicle = require('../models/Vehicle');

router.route('/add').post(async (req, res) => {
    const { registerNo, currentMileage, nextServiceMileage, serviceDate, totalCost } = req.body;

    try {
        // Check if the vehicle with the provided registration number exists
        const vehicle = await Vehicle.findOne({ registrationNo: registerNo });
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found. Please check the registration number." });
        }

        // If the vehicle exists, proceed with adding the maintenance record
        const newMaintain = new Maintain({
            registerNo,
            currentMileage: Number(currentMileage),
            nextServiceMileage: Number(nextServiceMileage),
            serviceDate,
            totalCost
        });

        await newMaintain.save();
        res.json("Maintenance record added");
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error adding maintenance record" });
    }
});

router.route("/").get((req, res) => {
    Maintain.find()
        .then((maintains) => {
            res.json(maintains);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: "Error fetching maintenance records" });
        });
});



router.route("/update/:maintainid").put(async (req, res) => {
    let maintainId = req.params.maintainid;
    const { registerNo, currentMileage, nextServiceMileage, serviceDate, totalCost } = req.body;

    try {
        // Check if the vehicle with the provided registration number exists
        const vehicle = await Vehicle.findOne({ registrationNo: registerNo });
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found. Please check the registration number." });
        }

        const updateMaintain = {
            registerNo,
            currentMileage: Number(currentMileage),
            nextServiceMileage: Number(nextServiceMileage),
            serviceDate,
            totalCost
        };

        const update = await Maintain.findByIdAndUpdate(maintainId, updateMaintain, { new: true });
        if (update) {
            res.status(200).send({ status: 'updated', maintain: update });
        } else {
            res.status(404).send({ status: 'Maintain record not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: 'Error with updating', error: err.message });
    }
});

router.route("/delete/:maintainid").delete(async (req, res) => {
    let maintainId = req.params.maintainid;

    try {
        await Maintain.findByIdAndDelete(maintainId);
        res.status(200).send({ status: 'success' });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: 'error', error: err.message });
    }
});

module.exports = router;
