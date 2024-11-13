import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import PriceChart from "./PriceChart";
import QuantitySelector from "./QuantitySelector";

const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const { food_list, addToCart } = useContext(StoreContext);
  const navigate = useNavigate();

  // State to handle quantity input
  // const [quantity, setQuantity] = useState(1); // Default quantity is 1

  // Find the product with the matching ID
  const product = food_list.find((item) => item._id === id);
  const price = product?.price;

  const minQuantity = 10; // Minimum quantity constant
  const maxQuantity = 100; // Maximum quantity constant
  const [quantity, setQuantity] = useState(10);
  const [unitPrice, setUnitPrice] = useState(price);
  const [discount, setDiscount] = useState(5);
  const [discountedPrice, setDiscountedPrice] = useState(unitPrice * quantity);
  const [savePrice, setSavePrice] = useState(0);
  const [minQuantityWarning, setMinQuantityWarning] = useState(false);
  const [maxQuantityWarning, setMaxQuantityWarning] = useState(false);

  const calculatePrice = (newQuantity) => {
    let newDiscount = 5; // Default discount

    // Set discount based on the quantity ranges
    if (newQuantity >= 26 && newQuantity <= 50) {
      newDiscount = 7;
    } else if (newQuantity >= 51 && newQuantity <= 100) {
      newDiscount = 11;
    } else if (newQuantity >= 101) {
      newDiscount = 14;
    }

    // Calculate the discount percentage and discounted unit price
    const discountMultiplier = 1 - newDiscount / 100;
    const newUnitPrice = price * discountMultiplier;

    // Calculate the final discounted price for the quantity
    const newDiscountedPrice = newUnitPrice * newQuantity;

    // Calculate total savings
    const totalSavings = price * newQuantity - newDiscountedPrice;

    // Set state values
    setUnitPrice(newUnitPrice);
    setDiscount(newDiscount);
    setDiscountedPrice(newDiscountedPrice);
    setSavePrice(totalSavings);
  };

  useEffect(() => {
    calculatePrice(quantity);
  }, [quantity]);

  // Early return after hooks are defined
  if (!product) {
    return <p>Product not found</p>;
  }
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < minQuantity) {
      setMinQuantityWarning(true);
      setMaxQuantityWarning(false);
    } else if (newQuantity > maxQuantity) {
      setMaxQuantityWarning(true);
      setMinQuantityWarning(false);
    } else {
      setQuantity(newQuantity);
      calculatePrice(newQuantity);
      setMinQuantityWarning(false);
      setMaxQuantityWarning(false);
    }
  };

  // Handle adding to cart with the selected quantity
  const handleBuyNow = () => {
    if (quantity > 0) {
      addToCart(id, quantity); // Add to cart with quantity
      navigate(`/order/${id}`); // Redirect to order page
    } else {
      alert("Please select a valid quantity.");
    }
  };

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart(id, quantity); // Add to cart with quantity
      alert(`${quantity} ${product.name}(s) added to cart!`);
      navigate(`/cart`);
    } else {
      alert("Please select a valid quantity.");
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 w-full min-h-screen">
      <div className="bg-white rounded-lg p-6 flex flex-col md:flex-row max-w-4xl w-full">
        {/* Left Section: Product Image */}
        <div className="md:w-1/2 relative flex flex-col">
          <div className="relative w-full" style={{ paddingBottom: "100%" }}>
            <img
              src={product.image}
              alt={product.name}
              className="absolute top-0 left-0 h-full w-full object-cover rounded-md"
            />
          </div>
          <div className="mt-4">
            <p>{product.category}</p>
            <h2 className="text-2xl font-semibold">{product.name}</h2>
            <p>{product.description}</p>
            <p className="text-gray-500">Rs {unitPrice.toFixed(0)}.00 Per Kg</p>
          </div>
        </div>

        {/* Right Section: Product Info */}
        <div className="md:w-1/2 mt-6 md:mt-0 md:ml-6">
          <div className="mt-4">
            <div className="text-gray-500">
              <span className="text-gray-500 pr-1 line-through">
                {" "}
                Rs {(unitPrice * quantity).toFixed(0)}.00{" "}
              </span>
              <span className="text-red-600 pr-1 font-bold">
                {" "}
                - {discount}% off{" "}
              </span>
            </div>
            <div className="text-black">
              <span className="pr-1 font-bold">Rs </span>
              <span className="text-4xl font-extrabold text-black-500">
                {discountedPrice.toFixed(2)}
              </span>
              <span className="pl-1 font-bold"> LKR </span>
              <p className="text-gray-500">
                Rs {unitPrice.toFixed(0)}.00 Per Kg
              </p>
            </div>
            <div className="text-red-600 mt-1">
              <span className="pr-1">Save</span>
              <span className="font-bold pr-1">Rs {savePrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Price Chart */}
          <div className="mt-6">
            <div className="text-sm font-medium text-gray-700">Price Chart</div>
            <PriceChart basePrice={price} />
          </div>

          {/* Quantity Selector */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <QuantitySelector
              quantity={quantity}
              onQuantityChange={handleQuantityChange}
              minQuantity={minQuantity}
              maxQuantity={maxQuantity}
            />

            {maxQuantityWarning && (
              <div className="mt-4 text-sm text-red-600">
                Quantity cannot exceed {maxQuantity}.
              </div>
            )}
            {minQuantityWarning && (
              <div className="mt-4 text-sm text-red-600">
                Quantity cannot be less than {minQuantity}.
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-6 space-y-3">
            <button
              onClick={handleAddToCart}
              className="w-full py-2 rounded-md font-semibold hover:bg-yellow-600"
              style={{ backgroundColor: "#FFCC00", color: "#000000" }}
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full py-2 rounded-md font-semibold hover:bg-green-600 text-white"
              style={{ backgroundColor: "#1DB233" }}
            >
              Buy it now
            </button>
          </div>

          {/* Delivery Information */}
          <div className="mt-4 text-sm text-red-600">
            Delivery charges calculated at checkout
          </div>

          {/* Share Button */}
          <div className="mt-2 text-left">
            <button className="text-gray-500 hover:text-gray-700">Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
