const router = require('express').Router();
const Fuelpurchase = require('../models/Fuelpurchase');
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');
const FuelEfficiency = require('../models/FuelEfficiency');
const Maintain = require('../models/Maintain'); 
const client = require('../config/twilio');

router.route('/add').post(async (req, res) => {
    const { driverNic, registerNo, mileage, liters, cost } = req.body;

    try {
        // Check if the driver with the provided NIC exists
        const driver = await Driver.findOne({ nic: driverNic });
        if (!driver) {
            return res.status(404).json({ message: "Driver not found. Please check the NIC." });
        }

        // Check if the vehicle with the provided registration number exists
        const vehicle = await Vehicle.findOne({ registrationNo: registerNo });
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found. Please check the registration number." });
        }

        // Calculate fuel efficiency and cost per kilometer
        const previousMileage = vehicle.mileage;
        const distanceTraveled = mileage - previousMileage;
        const fuelEfficiency = distanceTraveled / liters; // kilometers per liter
        const costPerLiter = cost / liters;
        const costPerKilometer = cost / distanceTraveled;

        // Save the fuel purchase record
        const newFuelpurchase = new Fuelpurchase({
            driverNic,
            registerNo,
            mileage,
            liters,
            cost
        });
        await newFuelpurchase.save();

        // Save fuel efficiency details
        const newFuelEfficiency = new FuelEfficiency({
            registerNo,
            previousMileage,
            currentMileage: mileage,
            liters,
            fuelEfficiency,
            costPerLiter,
            costPerKilometer
        });
        await newFuelEfficiency.save();

        // Update the vehicle's mileage
        vehicle.mileage = mileage;
        await vehicle.save();

        // Check next service mileage and send WhatsApp notification if required
        const maintainRecord = await Maintain.findOne({ registerNo });
        if (maintainRecord && mileage >= maintainRecord.nextServiceMileage-50) {
            // Send WhatsApp message
            const message = `*Reminder:*\nThe vehicle with registration number\n\n*${registerNo}*\n\nhas reached the next service mileage in next 50KMs of\n\n*${maintainRecord.nextServiceMileage} km*.\nPlease schedule a service.`;
            console.log('maintain check job executed');

            client.messages.create({
                body: message,
                from: 'whatsapp:+14155238886', // Replace with your Twilio WhatsApp number
                to: 'whatsapp:+94779257741'  // Replace with the fleet manager or driver's WhatsApp number
            }).then(message => console.log('msg sent')).catch(err => console.log(err));
        }

        res.json("Fuel purchase record and fuel efficiency data added");
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error adding fuel purchase record" });
    }
});


router.route("/").get((req, res) => {
    Fuelpurchase.find()
        .then((fuelpurchase) => {
            res.json(fuelpurchase);
        })
        .catch((err) => {
            console.log(err);
        });
});





router.route("/update/:fuelpurchaseid").put(async (req, res) => {
    let fuelpurchaseId = req.params.fuelpurchaseid;
    const { driverNic, registerNo, mileage, liters, cost } = req.body;

    const updatefuelpurchase = {
        driverNic,
        registerNo,
        mileage,
        liters,
        cost
    };

    try {
        const update = await Fuelpurchase.findByIdAndUpdate(fuelpurchaseId, updatefuelpurchase, { new: true });
        if (update) {
            res.status(200).send({ status: 'updated', fuelpurchase: update });
        } else {
            res.status(404).send({ status: 'Fuel purchase record not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: 'Error with updating', error: err.message });
    }
});

router.route("/delete/:fuelpurchaseid").delete(async (req, res) => {
    let fuelpurchaseId = req.params.fuelpurchaseid;

    try {
        await Fuelpurchase.findByIdAndDelete(fuelpurchaseId);
        res.status(200).send({ status: 'success' });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: 'error', error: err.message });
    }
});

router.post('/efficiency', async (req, res) => {
    console.log("Request body:", req.body);
    const { registerNo, year, month } = req.body;

    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const records = await FuelEfficiency.find({
            registerNo,
            date: { $gte: startDate, $lte: endDate }
        });

        if (records.length === 0) {
            return res.status(404).json({ message: "No records found for the specified month." });
        }

        const totalFuelEfficiency = records.reduce((acc, record) => acc + record.fuelEfficiency, 0) / records.length;
        const totalCostPerLiter = records.reduce((acc, record) => acc + record.costPerLiter, 0) / records.length;
        const totalCostPerKilometer = records.reduce((acc, record) => acc + record.costPerKilometer, 0) / records.length;

        res.json({
            registerNo,
            year,
            month,
            totalFuelEfficiency,
            totalCostPerLiter,
            totalCostPerKilometer
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "Error retrieving fuel efficiency data" });
    }
});



module.exports = router;
