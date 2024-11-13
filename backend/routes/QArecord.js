const router = require("express").Router();
let QARecord = require("../models/QArecord");
let IncomingBatch = require("../models/IncomingBatches");

//changes done by Senath (for twilio messages)
const twilio = require('twilio');
const accountSid = process.env.IM_TWILIO_ACCOUNT_SID;
const authToken = process.env.IM_TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendWhatsAppMessage = (message) => {
  client.messages
    .create({
      from: 'whatsapp:+14155238886', // Twilio WhatsApp number
      to: 'whatsapp:+94711519126', // Warehouse manager whatsapp (Senath)
      body: message,
    })
    .then(message => console.log("WhatsApp message sent:", message.sid))
    .catch(err => console.error("Failed to send WhatsApp message:", err));
};

module.exports = (io) => {
  // Route to add a new QA record
  router.route("/add").post(async (req, res) => {
    const { vegetableType, gradeAWeight, gradeBWeight, gradeCWeight, batchId, totalWeight } = req.body;

    const newQARecord = new QARecord({
      vegetableType,
      gradeAWeight,
      gradeBWeight,
      gradeCWeight,
      totalWeight,
      batchId
    });

    try {
      // Save the QA Record
      await newQARecord.save();

      // Delete the corresponding batch by batchId
      await IncomingBatch.findByIdAndDelete(batchId);

      // Emit new QA record event to connected clients
      if (io) {
        io.emit("new-qa-record", {
          vegetableType,
          gradeAWeight,
          gradeBWeight,
          gradeCWeight,
          totalWeight,
          batchId
        });
      }

      // Constructing the message to be sent - Senath
      const message = `A new batch of vegetables has arrived at the warehouse!

      - Vegetable Type: *${vegetableType}*
      - Batch Number: *${newQARecord.ID}*
      - Grade A: *${gradeAWeight} kg*
      - Grade B: *${gradeBWeight} kg*
      - Grade C: *${gradeCWeight} kg*`;

      // Send WhatsApp message - Senath
      sendWhatsAppMessage(message);

      res.json("QA Record added successfully and Incoming Batch deleted!");
    } catch (err) {
      res.status(400).json("Error: " + err);
    }
  });

  // Route to get all QA records
  router.route("/").get((req, res) => {
    QARecord.find()
      .then(records => res.json(records)) // The generated ID and calculated wastedWeight will be included in the response
      .catch(err => res.status(400).json("Error: " + err));
  });

  // Route to get a specific QA record by ID
  router.route("/get/:id").get((req, res) => {
    const { id } = req.params;

    QARecord.findById(id)
      .then(record => res.json(record)) // The generated ID and calculated wastedWeight will be included in the response
      .catch(err => res.status(400).json("Error: " + err));
  });

  // Route to update a specific QA record by ID
  router.route("/update/:id").put(async (req, res) => {
    const { id } = req.params;
    const { vegetableType, gradeAWeight, gradeBWeight, gradeCWeight } = req.body;

    try {
      // Find the existing record by ID
      const record = await QARecord.findById(id);
      if (!record) {
        return res.status(404).json("Error: QA Record not found");
      }

      // Update only the necessary fields
      record.vegetableType = vegetableType;
      record.gradeAWeight = gradeAWeight;
      record.gradeBWeight = gradeBWeight;
      record.gradeCWeight = gradeCWeight;

      // The pre-save hook will automatically recalculate totalWeight and wastedWeight
      await record.save();

      res.json("QA Record updated successfully!");
    } catch (err) {
      res.status(400).json("Error: " + err);
    }
  });

  // Route to delete a specific QA record by ID
  router.route("/delete/:id").delete(async (req, res) => {
    const { id } = req.params;

    try {
      await QARecord.findByIdAndDelete(id);
      res.json("QA Record deleted.");
    } catch (err) {
      res.status(400).json("Error: " + err);
    }
  });

  // Route to get only grade C records
  router.route("/gradeC").get((req, res) => {
    QARecord.find({ gradeCWeight: { $gt: 0 } })
      .then(records => res.json(records))
      .catch(err => res.status(400).json("Error: " + err));
  });

  return router;
};
