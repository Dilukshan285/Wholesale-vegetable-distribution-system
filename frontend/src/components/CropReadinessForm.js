import React, { useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";

const CropReadinessForm = () => {
  const [formData, setFormData] = useState({
    farmerNIC: "",
    cropVariety: "",
    quantity: "",
    expectedQuality: "",
    preferredPickupDate: "",
    preferredPickupTime: "",
    attachments: [],
  });

  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear errors for current field after change
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    // Mark the field as touched
    setTouchedFields((prevTouched) => ({ ...prevTouched, [name]: true }));

    // Validate the field
    validateField(name, value);
  };

  const handleKeyDown = (e) => {
    const allowedKeys = [
      "Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", ".", "Period"
    ];
  
    if (
      !/^[0-9]$/.test(e.key) && // Not a digit
      !allowedKeys.includes(e.key) // Not an allowed control key
    ) {
      e.preventDefault(); // Block the key press
    }
  };
  
  

  const validateNIC = (event) => {
    const input = event.target;
    // Allow only digits and 'V' or 'v'
    input.value = input.value.replace(/[^0-9Vv]/g, '');
};

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      attachments: [...e.target.files],
    }));
  };

  // Validation functions
  const validateField = (name, value) => {
    let errorMsg = "";

    switch (name) {
      case "farmerNIC":
        if (!/^\d{9}[Vv]$|^\d{12}$/.test(value)) {
          errorMsg =
            'NIC must be either 9 digits followed by "V" or 12 digits.';
        }
        break;
      case "quantity":
        if (!/^\d*\.?\d*$/.test(value)) {
          errorMsg = "Only numbers and periods are allowed in the quantity.";
        } else if (parseFloat(value) <= 0) {
          errorMsg = "Quantity must be greater than 0.";
        }
        break;
      case "preferredPickupDate":
        const today = new Date();
        const selectedDate = new Date(value);
        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 10); // Add 10 days to today's date

        if (selectedDate < today.setHours(0, 0, 0, 0)) {
          errorMsg = "You cannot select a past date.";
        } else if (selectedDate > maxDate) {
          errorMsg = "Pickup date must be within the next 10 days.";
        }
        break;
      case "preferredPickupTime":
        const pickupTime = new Date(`1970-01-01T${value}:00`); // Assume value is in "HH:MM" format
        const minTime = new Date("1970-01-01T02:00:00"); // 2:00 AM
        const maxTime = new Date("1970-01-01T12:00:00"); // 12:00 PM
        
        if (pickupTime < minTime || pickupTime > maxTime) {
          errorMsg = "Pickup time must be between 2:00 AM and 12:00 PM.";
        }
        break;
      default:
        if (!value) {
          errorMsg = `${name} cannot be empty.`;
        }
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
};
const validateQuantity = (event) => {
  const input = event.target;

  // Allow only digits and a single period
  input.value = input.value.replace(/[^0-9.]/g, '');

  // Prevent multiple periods
  const parts = input.value.split('.');
  if (parts.length > 2) {
    input.value = parts[0] + '.' + parts.slice(1).join('');
  }

  // Update the form data state
  setFormData((prev) => ({
    ...prev,
    [input.name]: input.value,
  }));
};


  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    // Validate all fields
    Object.keys(formData).forEach((field) => {
      validateField(field, formData[field]);
      if (errors[field]) valid = false;
    });

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fix the errors in the form.");
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        for (const file of value) {
          formDataToSend.append("attachments", file);
        }
      } else {
        formDataToSend.append(key, value);
      }
    });

    // Retrieve token from localStorage
    const token = localStorage.getItem("farmerToken");

    try {
      await axios.post(
        "http://localhost:3001/cropReadiness/notify",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Add token here
          },
        }
      );
      alert("Notification sent successfully!");
      window.location.reload(); 
      
    } catch (error) {
      console.error("Error sending notification:", error); // Log the actual error for better debugging
      alert("Error sending notification.");
    }
  };

  const handleRemoveAttachment = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      attachments: prevData.attachments.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Notify Crop Readiness</h2>

      <div className="mb-4">
      <label
  htmlFor="farmerNIC"
  className="block text-sm font-medium text-gray-700 mb-2"
>
  Farmer NIC
</label>
<input
  type="text"
  name="farmerNIC"
  id="farmerNIC"
  pattern="\d{9}[Vv]|\d{12}"
  maxLength="12"
  value={formData.farmerNIC}
  onChange={(e) => {
    const value = e.target.value;
    // Only allow digits or 'V'/'v'
    const sanitizedValue = value.replace(/[^0-9Vv]/g, '');
    handleChange({ target: { name: 'farmerNIC', value: sanitizedValue } });
  }}
  onBlur={handleBlur} // Trigger validation on blur
  required
  className={`border ${
    errors.farmerNIC ? "border-red-500" : "border-gray-300"
  } rounded p-2 w-full`}
/>
{errors.farmerNIC && (
  <p className="text-red-500 text-sm">{errors.farmerNIC}</p>
)}

      </div>

      <div className="mb-4">
        <label
          htmlFor="cropVariety"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Crop Variety
        </label>
        <select
          name="cropVariety"
          id="cropVariety"
          value={formData.cropVariety}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          required
          className={`border ${
            errors.cropVariety ? "border-red-500" : "border-gray-300"
          } rounded p-2 w-full`}
        >
          <option value="">Select Crop Variety</option>
          <option value="Carrot">Carrot</option>
          <option value="Cabbage">Cabbage</option>
          <option value="Leek">Leek</option>
          <option value="Potato">Potato</option>
        </select>
        {errors.cropVariety && (
          <p className="text-red-500 text-sm">{errors.cropVariety}</p>
        )}
      </div>

      <div className="mb-4">
  <label
    htmlFor="quantity"
    className="block text-sm font-medium text-gray-700 mb-2"
  >
    Quantity (in kg)
  </label>
  <input
    type="text"
    name="quantity"
    id="quantity"
    value={formData.quantity}
    onChange={validateQuantity} // Real-time validation added here
    onBlur={handleBlur} // Optional: Final validation on blur
    required
    className={`border ${
      errors.quantity ? "border-red-500" : "border-gray-300"
    } rounded p-2 w-full`}
  />
  {errors.quantity && (
    <p className="text-red-500 text-sm">{errors.quantity}</p>
  )}
</div>


      <div className="mb-4">
        <label
          htmlFor="expectedQuality"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Expected Quality
        </label>
        <select
          name="expectedQuality"
          id="expectedQuality"
          value={formData.expectedQuality}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          className={`border ${
            errors.expectedQuality ? "border-red-500" : "border-gray-300"
          } rounded p-2 w-full`}
        >
          <option value="">Select Quality</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        {errors.expectedQuality && (
          <p className="text-red-500 text-sm">{errors.expectedQuality}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="preferredPickupDate"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Preferred Pickup Date
        </label>
        <input
  type="date"
  name="preferredPickupDate"
  id="preferredPickupDate"
  value={formData.preferredPickupDate}
  onChange={handleChange}
  onBlur={handleBlur}
  required
  className={`border ${
    errors.preferredPickupDate ? "border-red-500" : "border-gray-300"
  } rounded p-2 w-full`}
  min={new Date().toISOString().split("T")[0]} // Disable past dates
  max={new Date(new Date().setDate(new Date().getDate() + 10))
    .toISOString()
    .split("T")[0]} // Restrict to the next 10 days
/>

        {errors.preferredPickupDate && (
          <p className="text-red-500 text-sm">{errors.preferredPickupDate}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="preferredPickupTime"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Preferred Pickup Time
        </label>
        <input
          type="time"
          name="preferredPickupTime"
          id="preferredPickupTime"
          value={formData.preferredPickupTime}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`border ${
            errors.preferredPickupTime ? "border-red-500" : "border-gray-300"
          } rounded p-2 w-full`}
          required
        />
        {errors.preferredPickupTime && (
          <p className="text-red-500 text-sm">{errors.preferredPickupTime}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="attachments"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Attachments
        </label>
        <input
          type="file"
          name="attachments"
          id="attachments"
          onChange={handleFileChange}
          onBlur={handleBlur}
          multiple
          className="border border-gray-300 rounded p-2 w-full"
        />
        {formData.attachments.length > 0 && (
          <div className="mt-2">
            <ul>
              {formData.attachments.map((file, index) => (
                <li key={index} className="flex items-center">
                  <span>{file.name}</span>
                  <button
                    type="button"
                    className="ml-2 text-red-600"
                    onClick={() => handleRemoveAttachment(index)}
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Submit
      </button>
    </form>
  );
};

export default CropReadinessForm;
