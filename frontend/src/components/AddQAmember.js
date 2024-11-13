import React, { useState } from "react";

const AddQAmember = () => {
  // Regular expressions for NIC formats
  const oldNICFormat = /^[0-9]{9}[Vv]$/; // Old format: 9 digits followed by V
  const newNICFormat = /^[0-9]{12}$/; // New format: 12 digits

  const [formData, setFormData] = useState({
    name: "",
    NIC: "",
    contactInfo: {
      email: "",
      phone: "",
    },
    birthDay: "",
    address: {
      street: "",
      city: "",
    },
    role: "QA-Team", // default role
    gender: "Male", // default gender
  });

  const [message, setMessage] = useState("");
  const [isGenderLocked, setIsGenderLocked] = useState(false); // New state for locking gender

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validation for name field: No numbers or special characters allowed
    if (name === "name" && /[^a-zA-Z\s]/.test(value)) {
      setMessage("Name can only contain letters.");
      return;
    }

    // Validation for phone field: Only allow digits and limit to 10 characters
    if (
      name === "contactInfo.phone" &&
      (/[^0-9]/.test(value) || value.length > 10)
    ) {
      setMessage(
        "Phone number must be a maximum of 10 digits and contain only numbers."
      );
      return;
    }

    if (name.includes("contactInfo") || name.includes("address")) {
      const [section, field] = name.split(".");
      setFormData((prevData) => ({
        ...prevData,
        [section]: {
          ...prevData[section],
          [field]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });

      if (name === "NIC") {
        handleNICChange(value);
      }
      if (name === "birthDay") {
        validateAge(value); // Validate age when user manually enters birth date
      }
    }
    setMessage(""); // Reset message on valid input
  };

  const handleNICChange = (nic) => {
    if (newNICFormat.test(nic)) {
      // New NIC format handling (this part remains the same)
      const birthYear = parseInt(nic.substring(0, 4), 10);
      let days = parseInt(nic.substring(4, 7), 10);

      let gender = "Male";
      if (days > 500) {
        gender = "Female";
        days -= 500;
      }

      const birthDate = calculateBirthDate(birthYear, days);

      setFormData((prevData) => ({
        ...prevData,
        gender,
        birthDay: birthDate,
      }));
      setIsGenderLocked(true); // Lock the gender field
      validateAge(birthDate);
    } else if (oldNICFormat.test(nic)) {
      // Old NIC format handling (e.g., 720721074V)
      const birthYearLastTwo = parseInt(nic.substring(0, 2), 10); // First 2 digits
      const birthYear = 1900 + birthYearLastTwo; // Assume 1900s for old NIC

      // Only set the birth year in the birthDay field, not the full date or gender
      setFormData((prevData) => ({
        ...prevData,
        birthDay: `${birthYear}-01-01`, // Only fill the year, set day to default
      }));

      setIsGenderLocked(false); // Unlock gender so the user can manually set it
    } else {
      setMessage("Invalid NIC format.");
      setIsGenderLocked(false); // Unlock gender in case of invalid NIC
    }
  };

  const calculateBirthDate = (year, days) => {
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

    // Create a new date starting from January 1st of the birth year
    const date = new Date(year, 0, 1); // January 1st of the given year
    date.setDate(date.getDate() + days); // Subtract 1 since day starts at 1, not 0

    return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  const validateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();

    if (
      age < 18 ||
      (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))
    ) {
      setMessage("User must be at least 18 years old.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateAge(formData.birthDay)) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/QATeam/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("QA Team Member added successfully!");
        setFormData({
          name: "",
          NIC: "",
          contactInfo: {
            email: "",
            phone: "",
          },
          birthDay: "",
          address: {
            street: "",
            city: "",
          },
          role: "QA-Team",
          gender: "Male",
        });
        setIsGenderLocked(false); // Unlock gender after successful submission
      } else {
        setMessage(result.message || "Error adding QA Team Member.");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Add QA Team Member
      </h2>
      {message && <p className="text-center text-red-500 mb-4">{message}</p>}
      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Name:
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* NIC Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            NIC:
          </label>
          <input
            type="text"
            name="NIC"
            value={formData.NIC}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            maxLength={12} // Allow up to 12 characters (including "V" for 9-digit format)
            pattern="\d{12}|\d{9}[vV]" // Regex pattern for validation
            title="NIC should be either 12 digits or 9 digits followed by 'V'."
          />
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email:
          </label>
          <input
            type="email"
            name="contactInfo.email"
            value={formData.contactInfo.email}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Phone Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Phone:
          </label>
          <input
            type="text"
            name="contactInfo.phone"
            value={formData.contactInfo.phone}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Birthdate Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Birthdate:
          </label>
          <input
            type="date"
            name="birthDay"
            value={formData.birthDay}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Address Fields */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Street Address:
          </label>
          <input
            type="text"
            name="address.street"
            value={formData.address.street}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            City:
          </label>
          <input
            type="text"
            name="address.city"
            value={formData.address.city}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Gender Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Gender:
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
            disabled={isGenderLocked}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Role Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Role:
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="QA-Team">QA Team</option>
            <option value="QA-Manager">QA Manager</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="px-4 py-2 bg-[#11532F] text-white font-medium rounded-md hover:bg-[#0e4b2b]"
          >
            Add Member
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddQAmember;
