// Import the User model
const User = require("../models/Usermodel.js");

const addToCart = async (req, res) => {
  try {
    const userId = req.body.userId;
    const quantity = req.body.quantity;

    console.log("userId", userId);

    let userData = await User.findById(userId);

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Retrieve the cartData or initialize it as an empty object
    let cartData = userData.cartData || {};

    // Add or update the item in the cart
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = quantity;
    } else {
      cartData[req.body.itemId] += quantity;
    }

    // Update the user's cart data
    await User.findByIdAndUpdate(userId, { cartData });

    // Send a success response
    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to add item to cart" });
  }
};

// Remove product from cart
const removeFromCart = async (req, res) => {
  try {
    console.log("Received request to remove item from cart:", req.body); // Log request body

    // Retrieve the user based on userId
    let userData = await User.findById(req.body.userId);

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {}; // Fallback to empty object if cartData is undefined

    // Check if the item exists in the cart
    if (cartData[req.body.itemId]) {
      console.log("Item found in cart. Removing item:", req.body.itemId);

      // Remove the item from the cart
      delete cartData[req.body.itemId];

      // Mark cartData as modified to ensure Mongoose detects the change
      userData.cartData = cartData;
      userData.markModified("cartData");
      await userData.save();

      console.log("Updated cartData after removal:", cartData);
      return res.json({ success: true, cartData });
    } else {
      return res.json({ success: false, message: "Item not found in cart" });
    }
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return res.json({
      success: false,
      message: "Error removing item from cart",
    });
  }
};

// Fetch user cart data
const getCart = async (req, res) => {
  try {
    let userData = await User.findById(req.body.userId);

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {}; // Use an empty object if cartData is null or undefined

    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving cart data" });
  }
};

module.exports = { addToCart, removeFromCart, getCart };
