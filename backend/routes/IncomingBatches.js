const router = require("express").Router();
const IncomingBatch = require("../models/IncomingBatches");
const twilio = require("twilio");

// Load Twilio credentials from environment variables
const accountSid = process.env.QATWILIO_ACCOUNT_SID;
const authToken = process.env.QATWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Twilio WhatsApp details
const fromWhatsAppNumber = 'whatsapp:+14155238886'; // Your Twilio WhatsApp number
const toWhatsAppNumber = 'whatsapp:+94714211115'; // Replace with the recipient's phone number

// Function to send WhatsApp message
const sendWhatsAppMessage = (message) => {
    client.messages
        .create({
            body: message,
            from: fromWhatsAppNumber,
            to: toWhatsAppNumber
        })
        .then((msg) => console.log(`WhatsApp message sent: ${msg.sid}`))
        .catch((err) => console.error('Failed to send WhatsApp message: ', err));
};

module.exports = (io) => {
    // Route to add a new incoming batch
    router.route("/add").post((req, res) => {
        const { vegetableType, totalWeight, arrivalDate } = req.body;

        const newIncomingBatch = new IncomingBatch({
            vegetableType,
            totalWeight,
            arrivalDate
        });

        newIncomingBatch.save()
            .then(() => {
                // Send WhatsApp notification
                const message = `New Batch arrived!!\nVegetable: ${vegetableType}\nWeight: ${totalWeight} kg\nArrival Date: ${arrivalDate}`;
                sendWhatsAppMessage(message);

                // Emit new batch event to connected clients
                if (io) {
                    io.emit("new-batch", {
                        vegetableType,
                        totalWeight,
                        arrivalDate
                    });
                }

                res.json("Incoming Batch added successfully!");
            })
            .catch(err => res.status(400).json("Error: " + err));
    });

    // Route to get all incoming batches
    router.route("/").get((req, res) => {
        IncomingBatch.find()
            .then(batches => res.json(batches))
            .catch(err => res.status(400).json("Error: " + err));
    });

    // Route to get a specific incoming batch by ID
    router.route("/get/:id").get((req, res) => {
        const { id } = req.params;

        IncomingBatch.findById(id)
            .then(batch => res.json(batch))
            .catch(err => res.status(400).json("Error: " + err));
    });

    // Route to update a specific incoming batch by ID
    router.route("/update/:id").put((req, res) => {
        const { id } = req.params;
        const { vegetableType, totalWeight, arrivalDate } = req.body;

        IncomingBatch.findById(id)
            .then(batch => {
                batch.vegetableType = vegetableType;
                batch.totalWeight = totalWeight;
                batch.arrivalDate = arrivalDate;

                batch.save()
                    .then(() => res.json("Incoming Batch updated successfully!"))
                    .catch(err => res.status(400).json("Error: " + err));
            })
            .catch(err => res.status(400).json("Error: " + err));
    });

    // Route to delete a specific incoming batch by ID
    router.route("/delete/:id").delete((req, res) => {
        const { id } = req.params;

        IncomingBatch.findByIdAndDelete(id)
            .then(() => res.json("Incoming Batch deleted."))
            .catch(err => res.status(400).json("Error: " + err));
    });

    return router; // Return router from the module
};
