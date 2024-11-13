import React from "react";
import { FaTrash } from "react-icons/fa"; 


const QuantitySelector = ({
  quantity,
  onQuantityChange,
  minQuantity,
  maxQuantity,
  handleRemoveItem, 
}) => {
  const updateQuantity = (amount) => {
    const newQuantity = quantity + amount;
    onQuantityChange(newQuantity);
  };
  
  return (
    <div className="flex items-center mt-2">
      <div className="flex items-center border rounded-lg">
        <button
          onClick={() => updateQuantity(-10)}
          className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
          disabled={quantity <= minQuantity}
        >
          -
        </button>
        <span className="font-bold px-4 py-2">
          {quantity} Kg
        </span>
        <button
          onClick={() => updateQuantity(10)}
          className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
          disabled={quantity >= maxQuantity} 
        >
          +
        </button>
      </div>
      {handleRemoveItem && (
        <button
          className="ml-4 text-gray-400 hover:text-red-600 transition"
          onClick={handleRemoveItem}
        >
          <FaTrash size={18} />
        </button>
      )}
    </div>
  );
};

export default QuantitySelector;
