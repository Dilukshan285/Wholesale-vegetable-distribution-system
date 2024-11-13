import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function AddFarmer() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [DOB, setDOB] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [NIC, setNIC] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [pwd, setPwd] = useState("");
  const [cnfrmPwd, setCnfrmPwd] = useState("");
  const [errors, setErrors] = useState({});

  // Function to calculate age based on DOB
  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  // Restrict First and Last name to alphabetical characters
  const handleNameChange = (setName) => (e) => {
    const value = e.target.value.replace(/[^a-zA-Z]/g, ""); // Allow only alphabets
    setName(value);
  };

  // Restrict date range for the Date of Birth
  const today = new Date();
  const minDate = new Date(
    today.getFullYear() - 60,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];
  const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  const handleNICChange = (e) => {
    let value = e.target.value;

    // Allow only digits and 'V', 'v', 'X', 'x'
    value = value.replace(/[^0-9VvXx]/g, "");

    // If the 10th character is 'V' or 'X', restrict further input
    if (value.length === 10 && /^[0-9]{9}[VvXx]$/.test(value)) {
      value = value.slice(0, 10); // Restrict to 9 digits + 'V'/'X'
    }
    // If it's not in the '9 digits + V/X' format, allow up to 12 digits
    else if (value.length > 12) {
      value = value.slice(0, 12); // Allow only up to 12 digits
    }

    setNIC(value);
    validateNIC(value); // Continue validation after setting NIC value
  };

  const validateNIC = (value) => {
    const dobYear = new Date(DOB).getFullYear();
    const dobYearLast2 = dobYear.toString().slice(-2);
    let error = "";

    const specialCharPattern = /[^a-zA-Z0-9]/g;

    if (specialCharPattern.test(value)) {
      error = "NIC should contain only letters and numbers.";
    } else if (value.length === 12) {
      const nicYear = value.slice(0, 4);
      const nicDays = parseInt(value.slice(4, 7));
      if (nicYear !== dobYear.toString()) {
        error = "NIC year does not match Date of Birth year.";
      } else if (gender === "Male" && nicDays >= 500) {
        error = "For males, NIC day values should be below 500.";
      } else if (gender === "Female" && nicDays < 500) {
        error = "For females, NIC day values should be 500 or above.";
      }
    } else if (value.length === 10 && /^[0-9]{9}[VvXx]$/.test(value)) {
      const nicYear = value.slice(0, 2);
      const nicDays = parseInt(value.slice(2, 5));
      if (nicYear !== dobYearLast2) {
        error = "NIC year does not match Date of Birth year.";
      } else if (gender === "Male" && nicDays >= 500) {
        error = "For males, NIC day values should be below 500.";
      } else if (gender === "Female" && nicDays < 500) {
        error = "For females, NIC day values should be 500 or above.";
      }
    } else {
      error =
        "Invalid NIC format. It should be either 12 digits or 9 digits followed by 'V' or 'X'.";
    }

    setErrors((prev) => ({ ...prev, NIC: error }));
  };

  // Contact number validation (allow only 10 digits)
  const handleContactChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers

    if (value.length > 10) {
      value = value.slice(0, 10); // Limit to 10 digits
    }

    setContact(value);

    if (value.length !== 10) {
      setErrors((prev) => ({
        ...prev,
        contact: "Contact number must be exactly 10 digits.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, contact: "" }));
    }
  };

  // Password validation
  const validatePassword = (pwd, cnfrmPwd) => {
    const passwordErrors = {};

    // Check if password and confirm password match
    if (pwd !== cnfrmPwd) {
      passwordErrors.cnfrmPwd = "Passwords do not match!";
    } else {
      passwordErrors.cnfrmPwd = "";
    }

    // Check if password meets the required length
    if (pwd.length < 8) {
      passwordErrors.pwd = "Password must be at least 8 characters!";
    } else {
      // Check for uppercase, lowercase, number, and special character only if length is sufficient
      const hasUpperCase = /[A-Z]/.test(pwd);
      const hasLowerCase = /[a-z]/.test(pwd);
      const hasNumber = /\d/.test(pwd);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

      if (!hasUpperCase) {
        passwordErrors.pwd =
          "Password must contain at least one uppercase letter!";
      } else if (!hasLowerCase) {
        passwordErrors.pwd =
          "Password must contain at least one lowercase letter!";
      } else if (!hasNumber) {
        passwordErrors.pwd = "Password must contain at least one number!";
      } else if (!hasSpecialChar) {
        passwordErrors.pwd =
          "Password must contain at least one special character!";
      } else {
        passwordErrors.pwd = ""; // Clear error if all conditions are met
      }
    }

    setErrors((prev) => ({ ...prev, ...passwordErrors }));
  };

  // Email validation
  const validateEmail = (value) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  // Function to validate form fields on submit
  const validateForm = () => {
    const newErrors = {};
    if (!firstName) newErrors.firstName = "First name is required.";
    if (!lastName) newErrors.lastName = "Last name is required.";
    if (!DOB) newErrors.DOB = "Date of Birth is required.";
    if (!NIC) newErrors.NIC = "NIC is required.";
    if (!gender) newErrors.gender = "Gender is required.";
    if (!address) newErrors.address = "Address is required.";
    if (!email) newErrors.email = "Email is required.";
    if (!contact) newErrors.contact = "Contact number is required.";
    if (!pwd) newErrors.pwd = "Password is required.";
    if (!cnfrmPwd) newErrors.cnfrmPwd = "Confirm Password is required.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const sendData = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const calculatedAge = calculateAge(DOB);
    const newFarmer = {
      firstName,
      lastName,
      DOB,
      age: calculatedAge,
      gender,
      NIC,
      address,
      email,
      contact,
      pwd,
    };

    axios
      .post("http://localhost:3001/farmer/add", newFarmer)
      .then(() => {
        alert("Farmer added");
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <div className="flex justify-center items-center p-8">
      {/* Form Section Only */}
      <div className="w-full lg:w-3/4 max-w-3xl">
        <div className="bg-white shadow-md rounded-lg p-8">
          <form onSubmit={sendData} className="space-y-6">
            <h2 className="text-2xl font-bold text-center">
              Join Our Farming Community
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  className={`form-input border ${
                    errors.firstName ? "border-red-500" : "border-gray-400"
                  } rounded-md p-2 w-full`}
                  placeholder="First Name"
                  value={firstName}
                  onChange={handleNameChange(setFirstName)}
                  required
                />
                <span className="text-red-500">{errors.firstName}</span>
              </div>
              <div>
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  className={`form-input border ${
                    errors.lastName ? "border-red-500" : "border-gray-400"
                  } rounded-md p-2 w-full`}
                  placeholder="Last Name"
                  value={lastName}
                  onChange={handleNameChange(setLastName)}
                  required
                />
                <span className="text-red-500">{errors.lastName}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  className={`form-input border ${
                    errors.DOB ? "border-red-500" : "border-gray-400"
                  } rounded-md p-2 w-full`}
                  placeholder="Date of Birth"
                  min={minDate}
                  max={maxDate}
                  value={DOB}
                  onChange={(e) => {
                    setDOB(e.target.value);
                    setAge(calculateAge(e.target.value));
                  }}
                  required
                />
                <span className="text-red-500">{errors.DOB}</span>
              </div>
              <div>
                <label className="block text-gray-700">Age</label>
                <input
                  type="number"
                  className="form-input border border-gray-400 rounded-md p-2 w-full"
                  placeholder="Age"
                  value={age}
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Gender</label>
                <select
                   className={`form-input border ${
                    errors.gender ? "border-red-500" : "border-gray-400"
                  } rounded-md p-2 w-full`}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <span className="text-red-500">{errors.gender}</span>
              </div>
              <div>
                <label className="block text-gray-700">NIC</label>
                <input
                  type="text" className={`form-input border ${
                    errors.NIC ? "border-red-500" : "border-gray-400"
                  } rounded-md p-2 w-full`}
                  placeholder="NIC"
                  value={NIC}
                  onChange={handleNICChange}
                  required
                />
                <span className="text-red-500">{errors.NIC}</span>
              </div>
            </div>

            <div>
              <label className="block text-gray-700">Address</label>
              <input
                type="text"
                className={`form-input border ${
                  errors.address ? "border-red-500" : "border-gray-400"
                } rounded-md p-2 w-full`}
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <span className="text-red-500">{errors.address}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email" className={`form-input border ${
                    errors.email ? "border-red-500" : "border-gray-400"
                  } rounded-md p-2 w-full`}
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  required
                />
                <span className="text-red-500">{errors.email}</span>
              </div>
              <div>
                <label className="block text-gray-700">Contact No.</label>
                <input
                  type="text"
                  className={`form-input border ${
                    errors.contact ? "border-red-500" : "border-gray-400"
                  } rounded-md p-2 w-full`}
                  placeholder="Contact"
                  value={contact}
                  onChange={handleContactChange}
                  required
                />
                <span className="text-red-500">{errors.contact}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  className={`form-input border ${
                    errors.pwd ? "border-red-500" : "border-gray-400"
                  } rounded-md p-2 w-full`}
                  placeholder="Password"
                  value={pwd}
                  onChange={(e) => {
                    setPwd(e.target.value);
                    validatePassword(e.target.value, cnfrmPwd);
                  }}
                  required
                />
                {errors.pwd && (
                  <p className="text-red-500 text-sm mt-1">{errors.pwd}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  className={`form-input border ${
                    errors.cnfrmPwd ? "border-red-500" : "border-gray-400"
                  } rounded-md p-2 w-full`}
                  placeholder="Confirm Password"
                  value={cnfrmPwd}
                  onChange={(e) => {
                    setCnfrmPwd(e.target.value);
                    validatePassword(pwd, e.target.value);
                  }}
                  required
                />
                <span className="text-red-500">{errors.cnfrmPwd}</span>
              </div>
            </div>
            <div className="text-center mt-4">
              <span className="text-gray-600">Already have an account? </span>
              <Link
                to={`/fm_layout/login_farmer`}
                className="text-green-500 hover:text-green-700 font-semibold"
              >
                Login Here
              </Link>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddFarmer;
