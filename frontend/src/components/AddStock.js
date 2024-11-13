import React, { useState } from "react";
import axios from "axios";

export default function AddStock() {
  const [vegType, setVegType] = useState("");
  const [qualityGrade, setQualityGrade] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expDate, setExpDate] = useState("");
  const [errors, setErrors] = useState({});

  const validateField = (field, value) => {
    const newErrors = { ...errors };

    if (field === "vegType" && !value) {
      newErrors.vegType = "Vegetable type is required.";
    } else if (field === "vegType") {
      delete newErrors.vegType;
    }

    if (field === "qualityGrade" && !value) {
      newErrors.qualityGrade = "Quality grade is required.";
    } else if (field === "qualityGrade") {
      delete newErrors.qualityGrade;
    }

    if (field === "quantity" && !value) {
      newErrors.quantity = "Quantity is required.";
    } else if (field === "quantity" && value <= 0) {
      newErrors.quantity = "Quantity must be greater than 0.";
    } else if (field === "quantity") {
      delete newErrors.quantity;
    }

    if (field === "expDate" && !value) {
      newErrors.expDate = "Expiration date is required.";
    } else if (field === "expDate") {
      delete newErrors.expDate;
    }

    const batchPrefixes = {
      Carrot: "CRT",
      Potato: "PTO",
      Cabbage: "CBG",
      Leeks: "LKS",
    };

    const expectedPrefix = batchPrefixes[vegType];
    const batchNumberPattern = /^[A-Z]{3}\d{4}$/;

    if (field === "batchNumber" && !value) {
      newErrors.batchNumber = "Batch number is required.";
    } else if (field === "batchNumber" && !value.match(batchNumberPattern)) {
      newErrors.batchNumber = "Batch number must be in the format 'XXX1234'.";
    } else if (field === "batchNumber" && expectedPrefix && value.substring(0, 3) !== expectedPrefix) {
      newErrors.batchNumber = `Batch number must start with "${expectedPrefix}" for ${vegType}.`;
    } else if (field === "batchNumber") {
      delete newErrors.batchNumber;
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!vegType) newErrors.vegType = "Vegetable type is required.";
    if (!qualityGrade) newErrors.qualityGrade = "Quality grade is required.";
    if (!quantity) {
      newErrors.quantity = "Quantity is required.";
    } else if (quantity <= 0) {
      newErrors.quantity = "Quantity must be greater than 0.";
    }
    if (!expDate) newErrors.expDate = "Expiration date is required.";

    const batchPrefixes = {
      Carrot: "CRT",
      Potato: "PTO",
      Cabbage: "CBG",
      Leeks: "LKS",
    };

    const expectedPrefix = batchPrefixes[vegType];
    const batchNumberPattern = /^[A-Z]{3}\d{4}$/;

    if (!batchNumber) {
      newErrors.batchNumber = "Batch number is required.";
    } else if (!batchNumber.match(batchNumberPattern)) {
      newErrors.batchNumber = "Batch number must be in the format 'XXX1234'.";
    } else if (expectedPrefix && batchNumber.substring(0, 3) !== expectedPrefix) {
      newErrors.batchNumber = `Batch number must start with "${expectedPrefix}" for ${vegType}.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    switch (id) {
      case "vegType":
        setVegType(value);
        validateField("vegType", value);
        break;
      case "qualityGrade":
        setQualityGrade(value);
        validateField("qualityGrade", value);
        break;
      case "batch-number":
        setBatchNumber(value);
        validateField("batchNumber", value);
        break;
      case "quantity":
        setQuantity(value);
        validateField("quantity", value);
        break;
      case "expDate":
        setExpDate(value);
        validateField("expDate", value);
        break;
      default:
        break;
    }
  };

  const sendData = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newStock = {
      vegType,
      qualityGrade,
      batchNumber,
      quantity,
      expDate,
    };

    axios
      .post("http://localhost:3001/stock/add-stocks", newStock)
      .then(() => {
        alert("Stock Added");

        setVegType("");
        setQualityGrade("");
        setBatchNumber("");
        setQuantity("");
        setExpDate("");
        setErrors({});
      })
      .catch((err) => {
        console.error("Error adding stock:", err.response?.data || err.message);
      });
  };

  const today = new Date();
  const minDate = new Date();
  minDate.setDate(today.getDate() + 7);
  const minDateString = minDate.toISOString().split("T")[0];

  return (
    <div className="max-w-xl m-3 bg-white p-6 rounded-lg shadow-md flex-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Add to Inventory</h2>
      <form onSubmit={sendData} className="space-y-6">
        <div>
          <label htmlFor="vegType" className="block text-m font-medium text-gray-700">
            Vegetable Type
          </label>
          <select
            id="vegType"
            className={`mt-1 block w-full h-12 border-2 border-gray-300 focus:border-green-500 rounded-md px-3 ${
              errors.vegType ? "border-red-500" : ""
            }`}
            value={vegType}
            onChange={handleChange}
          >
            <option value="" disabled>
              Choose an option
            </option>
            <option value="Carrot">Carrot</option>
            <option value="Potato">Potato</option>
            <option value="Cabbage">Cabbage</option>
            <option value="Leeks">Leeks</option>
          </select>
          {errors.vegType && <div className="text-red-500 text-sm mt-1">{errors.vegType}</div>}
        </div>

        <div>
          <label htmlFor="qualityGrade" className="block text-m font-medium text-gray-700">
            Quality Grade
          </label>
          <select
            id="qualityGrade"
            className={`mt-1 block w-full h-12 border-2 border-gray-300 focus:border-green-500 rounded-md px-3 ${
              errors.qualityGrade ? "border-red-500" : ""
            }`}
            value={qualityGrade}
            onChange={handleChange}
          >
            <option value="" disabled>
              Choose an option
            </option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
          {errors.qualityGrade && <div className="text-red-500 text-sm mt-1">{errors.qualityGrade}</div>}
        </div>

        <div>
          <label htmlFor="batch-number" className="block text-m font-medium text-gray-700">
            Batch Number
          </label>
          <input
            type="text"
            id="batch-number"
            className={`mt-1 block w-full h-12 border-2 border-gray-300 focus:outline-none focus:border-green-500 rounded-md px-3 ${
              errors.batchNumber ? "border-red-500" : ""
            }`}
            value={batchNumber}
            onChange={handleChange}
          />
          {errors.batchNumber && <div className="text-red-500 text-sm mt-1">{errors.batchNumber}</div>}
        </div>

        <div>
          <label htmlFor="quantity" className="block text-m font-medium text-gray-700">
            Quantity
          </label>
          <div className="mt-1 flex">
            <input
              type="number"
              id="quantity"
              className={`block w-full h-12 border-2 border-gray-300 focus:outline-none focus:border-green-500 rounded-l-md px-3 ${
                errors.quantity ? "border-red-500" : ""
              }`}
              value={quantity}
              onChange={handleChange}
            />
            <span className="ml-0 flex items-center border-2 border-gray-300 border-l-0 text-gray-700 bg-gray-100 rounded-r-md p-1">kg</span>
          </div>
          {errors.quantity && <div className="text-red-500 text-sm mt-1">{errors.quantity}</div>}
        </div>

        <div>
          <label htmlFor="expDate" className="block text-m font-medium text-gray-700">
            Expiration Date
          </label>
          <input
            type="date"
            id="expDate"
            className={`mt-1 block w-full h-12 border-2 border-gray-300 focus:outline-none focus:border-green-500 rounded-md px-3 ${
              errors.expDate ? "border-red-500" : ""
            }`}
            value={expDate}
            onChange={handleChange}
            min={minDateString}
          />
          {errors.expDate && <div className="text-red-500 text-sm mt-1">{errors.expDate}</div>}
        </div>

        <button
          type="submit"
          className="w-full h-12 bg-[#24c527] text-white font-semibold rounded-md hover:bg-green-600 transition duration-200 mt-20"
        >
          Add Stock
        </button>
      </form>
    </div>
  );
}
