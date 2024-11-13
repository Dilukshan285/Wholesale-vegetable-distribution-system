import React, { useContext, useState, useEffect } from "react";
import "./FoodDisplay.css"; // You can keep this for additional styles if needed
import { StoreContext } from "../../context/StoreContext.js";
import FoodItem from "../Product/Product";
import { useNavigate } from "react-router-dom";
import { FaHeadphonesAlt, FaMicrophoneAlt } from "react-icons/fa";

const ProductDisplay = () => {
  const { food_list } = useContext(StoreContext);
  const navigate = useNavigate(); // Hook for navigation

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [isListening, setIsListening] = useState(false); // State to track listening status
  const [recognition, setRecognition] = useState(null); // Speech recognition instance

  // Setup SpeechRecognition if available
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event) => {
        const voiceSearchTerm = event.results[0][0].transcript;
        setSearchTerm(voiceSearchTerm); // Set the recognized text as the search term
        setIsListening(false); // Stop listening
      };

      recognitionInstance.onend = () => {
        setIsListening(false); // Ensure we stop listening when speech recognition ends
      };

      setRecognition(recognitionInstance);
    } else {
      console.error("Speech Recognition not supported in this browser.");
    }
  }, []);

  const handleVoiceSearch = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
      setIsListening(!isListening); // Toggle listening state
    }
  };

  if (!food_list) {
    return <p className="text-center">Loading...</p>; // Handle case when food_list is not available
  }

  const handleClick = (id) => {
    navigate(`/product/${id}`); // Navigate to product detail page
  };

  // Filter and sort food_list based on search, category, and sort option
  const filteredFoodList = food_list
    .filter((item) => {
      const matchesSearchTerm = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearchTerm && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOption === "price-asc") return a.price - b.price;
      if (sortOption === "price-desc") return b.price - a.price;
      return 0; // Default sorting
    });

  return (
    <div className="food-display max-w-5xl mx-auto p-6 text-center">
      <div className="flex justify-between mb-6">
        <div className="flex gap-4 items-center w-full">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-72" // Increased width here
          />
          <button
            onClick={handleVoiceSearch}
            className={`p-2 border rounded-lg transition duration-300 ${
              isListening ? "bg-red-500" : "bg-green-500"
            } text-white flex items-center justify-center`}
          >
            {isListening ? (
              <>
                <FaHeadphonesAlt className="mr-2" />
                Listening...
              </>
            ) : (
              <>
                <FaMicrophoneAlt className="mr-2" />
                Voice Search
              </>
            )}
          </button>
        </div>
        <div className="flex gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Categories</option>
            <option value="Carrots">Carrots</option>
            <option value="Leeks">Leeks</option>
            <option value="Potatoes">Potatoes</option>
            {/* Add more categories as needed */}
          </select>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="default">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>
      <div className="food-display-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredFoodList.map((item, index) => {
          return (
            <FoodItem
              key={index}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
              onClick={() => handleClick(item._id)} // Pass the item ID on click
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProductDisplay;
