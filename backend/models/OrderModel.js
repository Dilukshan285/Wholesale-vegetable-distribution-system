const mongoose = require("mongoose");

// Define the order schema
const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    billingAddress: { type: Object, required: true },
    status: { type: String, default: "Processing" },
    payment: { type: Boolean, default: false },
    orderNumber: { type: String, unique: true }, // New field for user-friendly order number
  },
  { timestamps: true }
);

// Pre-save hook to generate a user-friendly order number before saving the order
orderSchema.pre("save", async function (next) {
  const order = this;

  // Check if orderNumber is already assigned
  if (!order.isNew || order.orderNumber) return next();

  try {
    // Find the total count of existing orders for the user
    const orderCount = await mongoose
      .model("Order")
      .countDocuments({ userId: order.userId });

    // Generate the order number based on the count (e.g., "01", "02", etc.)
    order.orderNumber = (orderCount + 30).toString().padStart(2, "0");

    next();
  } catch (error) {
    console.error("Error generating order number:", error);
    next(error);
  }
});

// Create and export the order model
const orderModel =
  mongoose.models.order || mongoose.model("Order", orderSchema);

module.exports = orderModel;
