const express = require("express");
const authMiddleware = require("../middleware/auth.js");

const { 
    placeOrder, 
    confirmPayment, 
    userOrders, 
    listOrders, 
    updateStatus, 
    addOrder, 
    fetchAllOrders, 
    updateOrderById,
    getOrderById,
    deleteOrderById
} = require("../controller/orderController.js");

const orderRouter = express.Router();

// Route definitions
orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", confirmPayment);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/list", listOrders);
orderRouter.get("/user-list", authMiddleware, userOrders);
orderRouter.put("/status", updateStatus);
orderRouter.get("/:id", getOrderById);
orderRouter.delete("/:id", authMiddleware, deleteOrderById);
orderRouter.post("/add-order", authMiddleware, addOrder);  // Add a new order
orderRouter.get("/all-orders", fetchAllOrders);  // Fetch all orders
orderRouter.put("/list-all-orders/:id", updateOrderById);  // Update order by ID

module.exports = orderRouter;

