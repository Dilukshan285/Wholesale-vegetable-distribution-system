const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const cron = require('node-cron');
const twilio = require('twilio');
const http = require("http");
const path = require('path');
const { Server } = require("socket.io");

// Load environment variables from .env file
dotenv.config();

const app = express();
const server = http.createServer(app); // Use http server for socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3002", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Set up PORT and MongoDB URL
const PORT = process.env.PORT || 3001;
const URL = process.env.MONGODB_URL;

// MongoDB connection
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once("open", () => {
  console.log("MongoDB connection successful!!");
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3002", credentials: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Twilio setup for WhatsApp
const accountSid = process.env.QATWILIO_ACCOUNT_SID;
const authToken = process.env.QATWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const fromWhatsAppNumber = 'whatsapp:+14155238886'; // Twilio WhatsApp number
const toWhatsAppNumber = 'whatsapp:+94714211115';  // Replace with recipient number

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

// Cron job to check for expiring batches (runs daily at midnight)
cron.schedule('0 0 * * *', async () => {
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  try {
    const expiringBatches = await IncomingBatch.find({
      arrivalDate: { $lt: twoDaysAgo }
    });

    expiringBatches.forEach(batch => {
      const message = `Batch about to expire!!\nVegetable: ${batch.vegetableType}\nWeight: ${batch.totalWeight} kg\nArrival Date: ${batch.arrivalDate}`;
      sendWhatsAppMessage(message);
    });

    if (expiringBatches.length === 0) {
      console.log('No batches are expiring today.');
    }
  } catch (error) {
    console.error('Error checking for expiring batches:', error);
  }
});

// Importing routes (local and remote)
const qaStandardsRouter = require("./routes/qaStandards");
const QARecordRouter = require("./routes/QArecord")(io);
const QAteamRouter = require("./routes/QATeam");
const newBatchRouter = require("./routes/IncomingBatches")(io);

// Farmer Routes
const farmerRouter = require("./routes/farmer_routes.js");
app.use("/farmer", farmerRouter);
app.use('/uploads', express.static('uploads'));

// Crop Readiness Routes
const cropReadinessRoutes = require('./routes/cropReadinessRoutes');
app.use('/cropReadiness', cropReadinessRoutes);

// Pickup request Routes
const pickupRequestRoutes = require('./routes/pickupRequestRoutes');
app.use('/pickup-request', pickupRequestRoutes);

// Land Routes
const landRoutes = require("./routes/land_routes");
app.use("/land", landRoutes);

// User-related Routes
const userRoutes = require("./routes/UserRoute.js");
const AuthRoute = require("./routes/AuthRoute.js");
app.use("/api/user", userRoutes);
app.use("/api/auth", AuthRoute);

//unit pricing routes
const unitPricesRoutes = require('./routes/unitPrices');
app.use('/unitPrices', unitPricesRoutes);

// Other Routes (remote)
const stockRouter = require("./routes/stocks.js");
const staffRouter = require("./routes/staffMembers.js");
const driverRouter = require("./routes/drivers.js");
const vehicleRouter = require("./routes/vehicles.js");
const fuelpurchaseRouter = require("./routes/fuelpurchase.js");
const maintainRouter = require("./routes/maintain.js");
const fuelEfficiencyRouter = require("./routes/fuelEfficiency");
const expensesRouter = require('./routes/expenses');
const orderRoutes = require("./routes/orderRoutes.js");
const cartRouter = require("./routes/cartRoutes.js");
const farmerRequestRoutes = require("./routes/farmerRequestRoutes.js");
const customerRequestRoutes = require("./routes/customerRequestRoutes.js");
const productRoutes = require('./routes/productRoutes');

// Use merged routes
app.use("/stock", stockRouter);
app.use("/staff", staffRouter);
app.use("/vehicle", vehicleRouter);
app.use("/driver", driverRouter);
app.use("/fuelpurchase", fuelpurchaseRouter);
app.use("/maintain", maintainRouter);
app.use("/efficiency", fuelEfficiencyRouter);
app.use("/expenses", expensesRouter);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRouter);
app.use("/api", farmerRequestRoutes);
app.use("/api", customerRequestRoutes);
app.use("/qaStandards", qaStandardsRouter);
app.use("/QArecord", QARecordRouter);
app.use("/QATeam", QAteamRouter);
app.use("/incomingBatches", newBatchRouter);
app.use('/api/products', productRoutes);

// Scheduler for license check (remote)
require('./schedulers/licenseCheckScheduler.js');

// Socket.io for handling real-time connections
io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Production mode setup (serve frontend if in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
