import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentPage = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvc, setCVC] = useState("");
  const [zip, setZip] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state;

  // Validation functions
  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validateString = (value) => /^[A-Za-z]+$/.test(value); // Only letters
  const validateCardNumber = (value) =>
    /^\d{16}$/.test(value.replace(/\s/g, "")); // Allow spaces
  const validateExpirationDate = (value) =>
    /^(0[1-9]|1[0-2])\/\d{2}$/.test(value); // MM/YY format
  const validateCVC = (value) => /^\d{3}$/.test(value);
  const validateZip = (value) => /^\d{5}$/.test(value); // 5 digits

  // Format the card number (add space after every 4 digits)
  const formatCardNumber = (value) => {
    return value.replace(/\s?/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  // Improved expiration date formatting logic
  const handleExpirationDateChange = (value) => {
    let cleanedValue = value.replace(/\D/g, ""); // Remove non-digit characters

    if (cleanedValue.length > 2) {
      cleanedValue = `${cleanedValue.slice(0, 2)}/${cleanedValue.slice(2, 4)}`;
    }

    return cleanedValue;
  };

  // Handle input change and validate in real-time
  const handleInputChange = (field, value) => {
    let newErrors = { ...errors };

    switch (field) {
      case "email":
        setEmail(value);
        if (!validateEmail(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;
      case "firstName":
        const firstNameValue = value.replace(/[^A-Za-z]/g, ""); // Restrict to letters only
        setFirstName(firstNameValue);
        if (!validateString(firstNameValue)) {
          newErrors.firstName = "First Name can only contain letters";
        } else {
          delete newErrors.firstName;
        }
        break;
      case "lastName":
        const lastNameValue = value.replace(/[^A-Za-z]/g, ""); // Restrict to letters only
        setLastName(lastNameValue);
        if (!validateString(lastNameValue)) {
          newErrors.lastName = "Last Name can only contain letters";
        } else {
          delete newErrors.lastName;
        }
        break;
      case "cardNumber":
        const formattedCardNumber = formatCardNumber(
          value.replace(/\D/g, "").slice(0, 16)
        ); // Allow only digits and limit to 16
        setCardNumber(formattedCardNumber);
        if (!validateCardNumber(formattedCardNumber)) {
          newErrors.cardNumber = "Card Number must be exactly 16 digits";
        } else {
          delete newErrors.cardNumber;
        }
        break;
      case "expirationDate":
        const formattedExpirationDate = handleExpirationDateChange(value);
        setExpirationDate(formattedExpirationDate);
        if (!validateExpirationDate(formattedExpirationDate)) {
          newErrors.expirationDate =
            "Expiration Date must follow the MM/YY format";
        } else {
          delete newErrors.expirationDate;
        }
        break;
      case "cvc":
        const cvcValue = value.replace(/\D/g, "").slice(0, 3); // Allow only 3 digits
        setCVC(cvcValue);
        if (!validateCVC(cvcValue)) {
          newErrors.cvc = "CVC must be exactly 3 digits.";
        } else {
          delete newErrors.cvc;
        }
        break;
      case "zip":
        const zipValue = value.replace(/\D/g, "").slice(0, 5); // Allow only 5 digits
        setZip(zipValue);
        if (!validateZip(zipValue)) {
          newErrors.zip = "ZIP code must be exactly 5 digits.";
        } else {
          delete newErrors.zip;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handlePayment = async () => {
    if (
      Object.keys(errors).length > 0 ||
      !email ||
      !firstName ||
      !lastName ||
      !cardNumber ||
      !expirationDate ||
      !cvc ||
      !zip
    ) {
      alert("Please fill in all the fields correctly before submitting.");
      return;
    }

    try {
      if (!orderData || !orderData.amount) {
        console.error(
          "Order data is not available or missing required fields."
        );
        return;
      }

      const updatedOrderData = { ...orderData, payment: true };
      console.log("Updated Order Data:", updatedOrderData);

      await axios.post(
        "http://localhost:3001/api/orders/add-order",
        updatedOrderData
      );

      setTimeout(() => {
        alert("Payment Successful");
        navigate("/my-orders");
      }, 1000);
    } catch (error) {
      console.error("Payment error:", error);
      alert("An error occurred during payment. Please try again.");
    }
  };

  return (
    <div className="max-w-md mt-16 mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Payment Summary</h2>

      <div className="mb-6">
        <div className="border border-green-500 rounded-lg p-6 bg-green-50 text-green-700 text-xl font-semibold hover:bg-green-100 transition duration-200 ease-in-out">
          Amount to Pay LKR {orderData?.amount ?? "N/A"}
        </div>
      </div>

      <h3 className="text-lg mb-4">Fill up your personal information</h3>

      <form className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={`w-full p-2 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-lg`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="flex space-x-4">
          <div className="w-1/2">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className={`w-full p-2 border ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              } rounded-lg`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName}</p>
            )}
          </div>
          <div className="w-1/2">
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className={`w-full p-2 border ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              } rounded-lg`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <input
            type="text"
            placeholder="Card Number"
            value={cardNumber}
            onChange={(e) => handleInputChange("cardNumber", e.target.value)}
            className={`w-full p-2 border ${
              errors.cardNumber ? "border-red-500" : "border-gray-300"
            } rounded-lg`}
          />
          {errors.cardNumber && (
            <p className="text-red-500 text-sm">{errors.cardNumber}</p>
          )}
        </div>

        <div className="flex space-x-4">
          <div className="w-1/3">
            <input
              type="text"
              placeholder="Expiration Date (MM/YY)"
              value={expirationDate}
              onChange={(e) =>
                handleInputChange("expirationDate", e.target.value)
              }
              className={`w-full p-2 border ${
                errors.expirationDate ? "border-red-500" : "border-gray-300"
              } rounded-lg`}
            />
            {errors.expirationDate && (
              <p className="text-red-500 text-sm">{errors.expirationDate}</p>
            )}
          </div>
          <div className="w-1/3">
            <input
              type="text"
              placeholder="CVC"
              value={cvc}
              onChange={(e) => handleInputChange("cvc", e.target.value)}
              className={`w-full p-2 border ${
                errors.cvc ? "border-red-500" : "border-gray-300"
              } rounded-lg`}
            />
            {errors.cvc && <p className="text-red-500 text-sm">{errors.cvc}</p>}
          </div>
          <div className="w-1/3">
            <input
              type="text"
              placeholder="ZIP"
              value={zip}
              onChange={(e) => handleInputChange("zip", e.target.value)}
              className={`w-full p-2 border ${
                errors.zip ? "border-red-500" : "border-gray-300"
              } rounded-lg`}
            />
            {errors.zip && <p className="text-red-500 text-sm">{errors.zip}</p>}
          </div>
        </div>

        <button
          type="button"
          onClick={handlePayment}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold"
        >
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;
