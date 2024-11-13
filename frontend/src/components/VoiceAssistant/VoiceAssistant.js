import React, { useState } from "react";

const VoiceSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.onstart = () => {
    setIsListening(true);
  };

  recognition.onresult = (event) => {
    const voiceQuery = event.results[0][0].transcript;
    setSearchQuery(voiceQuery);
    handleVoiceCommand(voiceQuery); // Use handleVoiceCommand to process voice commands
  };

  recognition.onend = () => {
    setIsListening(false);
  };

  const handleVoiceCommand = (voiceCommand) => {
    const lowerCaseCommand = voiceCommand.toLowerCase();

    // 1. Search Command - Matching various phrases for searching
    const searchMatch = lowerCaseCommand.match(/search for (.+)/i);
    if (searchMatch) {
      const product = searchMatch[1].trim();
      handleSearch(product);
      return;
    }

    // 2. Add to Cart Command - Supports adding products with optional quantity
    const addToCartMatch = lowerCaseCommand.match(
      /add (\d+)?\s?(.*?) to cart/i
    );
    if (addToCartMatch) {
      const quantity = addToCartMatch[1] ? parseInt(addToCartMatch[1], 10) : 1; // Default to 1 if no quantity is mentioned
      const product = addToCartMatch[2].trim();
      addToCart(product, quantity); // Call the function with product name and quantity
      return;
    }

    // 3. Checkout Command - Various ways to initiate checkout
    if (
      lowerCaseCommand.includes("checkout") ||
      lowerCaseCommand.includes("proceed to checkout")
    ) {
      proceedToCheckout();
      return;
    }

    // 4. Remove from Cart Command - Allowing removal of items from cart
    const removeFromCartMatch = lowerCaseCommand.match(
      /remove (\d+)?\s?(.*?) from cart/i
    );
    if (removeFromCartMatch) {
      const quantity = removeFromCartMatch[1]
        ? parseInt(removeFromCartMatch[1], 10)
        : 1; // Default to 1 if no quantity is mentioned
      const product = removeFromCartMatch[2].trim();
      removeFromCart(product, quantity);
      return;
    }

    // 5. View Cart Command - Allow user to view items in their cart
    if (
      lowerCaseCommand.includes("view cart") ||
      lowerCaseCommand.includes("show my cart")
    ) {
      showCart();
      return;
    }

    // 6. Error or Unknown Command Handling
    provideFeedback(
      "Sorry, I didn't understand that command. Please try again."
    );
  };

  const handleVoiceClick = () => {
    recognition.start();
  };

  const handleSearch = (product) => {
    console.log(`Searching for: ${product}`);
    // Add logic to handle product search
  };

  const addToCart = (product, quantity) => {
    console.log(`Adding ${quantity} of ${product} to the cart.`);
    // Add logic to add product to cart
  };

  const removeFromCart = (product, quantity) => {
    console.log(`Removing ${quantity} of ${product} from the cart.`);
    // Add logic to remove product from cart
  };

  const showCart = () => {
    console.log("Displaying cart contents.");
    // Add logic to display the cart contents
  };

  const proceedToCheckout = () => {
    console.log("Proceeding to checkout.");
    // Add logic for checkout
  };

  const provideFeedback = (message) => {
    console.log(message);
    // Add logic to provide feedback to the user, either by voice or UI
  };

  return (
    <div>
      <button onClick={handleVoiceClick}>
        {isListening ? "Listening..." : "Click to speak"}
      </button>
      <p>Voice Command: {searchQuery}</p>
    </div>
  );
};

export default VoiceSearch;
