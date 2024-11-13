import React, { useState } from "react";
import axios from "axios";

export default function AddStaff() {
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    nic: "",
    email: "",
    address: "",
    district: "",
    contactNumber: "",
    dob: "",
    role: "",
    employeeId: "",
  });

  const [errors, setErrors] = useState({});

  // Function to validate names (no numbers or special characters)
  const validateName = (name) => {
    const namePattern = /^[a-zA-Z\s]+$/;
    return namePattern.test(name) ? null : "Name cannot contain numbers or special characters.";
  };

  const validateNIC = (nic, gender) => {
    const newNICPattern = /^[0-9]{12}$/;
    const oldNICPattern = /^[0-9]{9}[vVxX]$/;
    let daysFromJan1;

    if (newNICPattern.test(nic)) {
      daysFromJan1 = parseInt(nic.substring(4, 7), 10);
    } else if (oldNICPattern.test(nic)) {
      daysFromJan1 = parseInt(nic.substring(2, 5), 10);
    } else {
      return "Invalid NIC format.";
    }

    if (
      (gender === "Male" && daysFromJan1 >= 500) ||
      (gender === "Female" && daysFromJan1 < 500)
    ) {
      return "NIC does not match with the selected gender.";
    }

    return null;
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email) ? null : "Invalid email format.";
  };

  const validateAddress = (address) => {
    const addressPattern = /^[^,]+,\s*[^,]+,\s*[^,]+$/;
    return addressPattern.test(address) ? null : "Invalid address format.";
  };

  const validateContactNumber = (contactNumber) => {
    const contactNumberPattern = /^07[0-9]{8}$/;
    return contactNumberPattern.test(contactNumber) ? null : "Invalid contact number.";
  };

  const getBirthYearFromNIC = (nic) => {
    if (/^[0-9]{12}$/.test(nic)) {
      return parseInt(nic.substring(0, 4), 10);
    } else if (/^[0-9]{9}[vVxX]$/.test(nic)) {
      let year = parseInt(nic.substring(0, 2), 10);
      return year + 1900;
    }
    return null;
  };

  const validateDob = (dob) => {
    const currentYear = new Date().getFullYear();
    const birthYear = getBirthYearFromNIC(formValues.nic);
    return ((currentYear - birthYear) >= 18 && (currentYear - birthYear) <= 60) ? null : "Employee must be above 18 and below 60 years old.";
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formValues.firstName) newErrors.firstName = "First name is required.";
    else {
      const firstNameError = validateName(formValues.firstName);
      if (firstNameError) newErrors.firstName = firstNameError;
    }

    if (!formValues.lastName) newErrors.lastName = "Last name is required.";
    else {
      const lastNameError = validateName(formValues.lastName);
      if (lastNameError) newErrors.lastName = lastNameError;
    }

    if (!formValues.gender) newErrors.gender = "Gender is required.";
    if (!formValues.district) newErrors.district = "District is required.";
    if (!formValues.role) newErrors.role = "Role is required.";
    
    if (!formValues.nic) newErrors.nic = "NIC is required.";
    else {
      const nicError = validateNIC(formValues.nic, formValues.gender);
      if (nicError) newErrors.nic = nicError;
    }

    if (!formValues.email) newErrors.email = "Email is required.";
    else {
      const emailError = validateEmail(formValues.email);
      if (emailError) newErrors.email = emailError;
    }

    if (!formValues.address) newErrors.address = "Address is required.";
    else {
      const addressError = validateAddress(formValues.address);
      if (addressError) newErrors.address = addressError;
    }

    if (!formValues.contactNumber) newErrors.contactNumber = "Contact number is required.";
    else {
      const contactNumberError = validateContactNumber(formValues.contactNumber);
      if (contactNumberError) newErrors.contactNumber = contactNumberError;
    }

    if (!formValues.dob) newErrors.dob = "Date of birth is required.";
    else {
      const dateOfBirthError = validateDob(formValues.dob);
      if(dateOfBirthError) newErrors.dob = dateOfBirthError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormValues((prevState) => ({
      ...prevState,
      [field]: value,
    }));

    let updatedErrors = { ...errors };

    switch (field) {
      case "firstName":
      case "lastName":
        const nameError = validateName(value);
        if (nameError) updatedErrors[field] = nameError;
        else delete updatedErrors[field];
        break;
      case "nic":
        const nicError = validateNIC(value, formValues.gender);
        if (nicError) updatedErrors.nic = nicError;
        else delete updatedErrors.nic;
        break;
      case "email":
        const emailError = validateEmail(value);
        if (emailError) updatedErrors.email = emailError;
        else delete updatedErrors.email;
        break;
      case "address":
        const addressError = validateAddress(value);
        if (addressError) updatedErrors.address = addressError;
        else delete updatedErrors.address;
        break;
      case "contactNumber":
        const contactNumberError = validateContactNumber(value);
        if (contactNumberError) updatedErrors.contactNumber = contactNumberError;
        else delete updatedErrors.contactNumber;
        break;
      case "dob":
        const dobError = validateDob(value);
        if (dobError) updatedErrors.dob = dobError;
        else delete updatedErrors.dob;
        break;
      default:
        break;
    }

    setErrors(updatedErrors);
  };

  function sendData(e) {
    e.preventDefault();
    if (!validateForm()) return;

    const newStaff = {
      ...formValues
    };

    axios.post("http://localhost:3001/staff/add-staff", newStaff)
      .then(() => {
        alert("Staff Added");
        
        setFormValues("");
        setErrors({});
      })
      .catch((e) => {
        console.log(e.response.data);
      });
  }

  const birthYear = getBirthYearFromNIC(formValues.nic);
  const minDate = birthYear ? `${birthYear}-01-01` : null;
  const maxDate = birthYear ? `${birthYear}-12-31` : null;

  return (
    <div className="max-w-3xl m-3 bg-white p-6 rounded-lg shadow-md flex-auto">
      <h2 className="text-3xl font-bold text-center mb-12">Staff Member Registration</h2>
      <form className="space-y-4" onSubmit={sendData}>
      <div className="grid grid-cols-2 gap-10">
        <div>
          <div>
            <label className="block text-m font-medium text-gray-700 mt-1">First Name</label>
            <input
              type="text"
              className={`mt-1 block w-full h-12 border-2 border-gray-200 focus:outline-none focus:border-green-500 rounded-md px-3 ${errors.firstName ? 'border-red-500' : ''}`}
              value={formValues.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
            />
            {errors.firstName && <div className="text-red-500">{errors.firstName}</div>}
          </div>
          <div>
            <label className="block text-m font-medium text-gray-700 mt-1">Last Name</label>
            <input
              type="text"
              className={`mt-1 block w-full h-12 border-2 border-gray-200 focus:outline-none focus:border-green-500 rounded-md px-3 ${errors.lastName ? 'border-red-500' : ''}`}
              value={formValues.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
            />
            {errors.lastName && <div className="text-red-500">{errors.lastName}</div>}
          </div>

        <div>
          <label className="block text-m font-medium text-gray-700 mt-1">Gender</label>
          <select
            className={`mt-1 block w-full h-12 border-2 border-gray-200 focus:border-green-500 rounded-md px-3 ${errors.gender ? 'border-red-500' : ''}`}
            value={formValues.gender}
            onChange={(e) => handleInputChange("gender", e.target.value)}
          >
            <option value="" disabled>Choose an option</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.gender && <div className="text-red-500">{errors.gender}</div>}
        </div>

        <div>
          <label className="block text-m font-medium text-gray-700 mt-1">NIC Number</label>
          <input
            type="text"
            className={`mt-1 block w-full h-12 border-2 border-gray-200 focus:outline-none focus:border-green-500 rounded-md px-3 ${errors.nic ? 'border-red-500' : ''}`}
            value={formValues.nic}
            onChange={(e) => handleInputChange("nic", e.target.value)}
          />
          {errors.nic && <div className="text-red-500">{errors.nic}</div>}
        </div>

        <div>
          <label className="block text-m font-medium text-gray-700 mt-1">Email</label>
          <input
            type="email"
            className={`mt-1 block w-full h-12 border-2 border-gray-200 focus:outline-none focus:border-green-500 rounded-md px-3 ${errors.email ? 'border-red-500' : ''}`}
            value={formValues.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          {errors.email && <div className="text-red-500">{errors.email}</div>}
        </div>

        <button
          type="submit"
          className="w-full h-12 bg-[#24c527] text-white font-semibold rounded-md hover:bg-green-600 transition duration-200 mt-10"
        >
          Add Staff
        </button>
        </div>
        <div>
        <div>
          <label className="block text-m font-medium text-gray-700 mt-1">Address (Number, Street, City)</label>
          <input
            type="text"
            className={`mt-1 block w-full h-12 border-2 border-gray-200 focus:outline-none focus:border-green-500 rounded-md px-3 ${errors.address ? 'border-red-500' : ''}`}
            value={formValues.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
          />
          {errors.address && <div className="text-red-500">{errors.address}</div>}
        </div>

        <div>
          <label className="block text-m font-medium text-gray-700 mt-1">District</label>
          <select
            className={`mt-1 block w-full h-12 border-2 border-gray-200 focus:border-green-500 rounded-md px-3 ${errors.district ? 'border-red-500' : ''}`}
            value={formValues.district}
            onChange={(e) => handleInputChange("district", e.target.value)}
          >
            <option value="" disabled>Choose an option</option>
            <option value="Ampara">Ampara</option>
            <option value="Anuradhapura">Anuradhapura</option>
            <option value="Badulla">Badulla</option>
            <option value="Batticaloa">Batticaloa</option>
            <option value="Colombo">Colombo</option>
            <option value="Galle">Galle</option>
            <option value="Gampaha">Gampaha</option>
            <option value="Hambantota">Hambantota</option>
            <option value="Jaffna">Jaffna</option>
            <option value="Kalutara">Kalutara</option>
            <option value="Kandy">Kandy</option>
            <option value="Kegalle">Kegalle</option>
            <option value="Kilinochchi">Kilinochchi</option>
            <option value="Kurunegala">Kurunegala</option>
            <option value="Mannar">Mannar</option>
            <option value="Matale">Matale</option>
            <option value="Matara">Matara</option>
            <option value="Monaragala">Monaragala</option>
            <option value="Mullaitivu">Mullaitivu</option>
            <option value="Nuwara Eliya">Nuwara Eliya</option>
            <option value="Polonnaruwa">Polonnaruwa</option>
            <option value="Puttalam">Puttalam</option>
            <option value="Ratnapura">Ratnapura</option>
            <option value="Trincomalee">Trincomalee</option>
            <option value="Vavuniya">Vavuniya</option>
          </select>
          {errors.district && <div className="text-red-500">{errors.district}</div>}
        </div>

        <div>
          <label className="block text-m font-medium text-gray-700 mt-1">Contact Number</label>
          <input
            type="text"
            className={`mt-1 block w-full h-12 border-2 border-gray-200 focus:outline-none focus:border-green-500 rounded-md px-3 ${errors.contactNumber ? 'border-red-500' : ''}`}
            value={formValues.contactNumber}
            onChange={(e) => handleInputChange("contactNumber", e.target.value)}
          />
          {errors.contactNumber && <div className="text-red-500">{errors.contactNumber}</div>}
        </div>

        <div>
          <label className="block text-m font-medium text-gray-700 mt-1">Date of Birth</label>
          <input
            type="date"
            className={`mt-1 block w-full h-12 border-2 border-gray-200 focus:outline-none focus:border-green-500 rounded-md px-3 ${errors.dob ? 'border-red-500' : ''}`}
            value={formValues.dob}
            onChange={(e) => handleInputChange("dob", e.target.value)}
            min={minDate}
            max={maxDate}
          />
          {errors.dob && <div className="text-red-500">{errors.dob}</div>}
        </div>

        <div>
          <label className="block text-m font-medium text-gray-700 mt-1">Role</label>
          <select
            className={`mt-1 block w-full h-12 border-2 border-gray-200 focus:border-green-500 rounded-md px-3 ${errors.role ? 'border-red-500' : ''}`}
            value={formValues.role}
            onChange={(e) => handleInputChange("role", e.target.value)}
          >
            <option value="" disabled>Choose an option</option>
            <option value="WSS">Warehouse Storage Staff</option>
            <option value="WMS">Warehouse Maintenance Staff</option>
          </select>
          {errors.role && <div className="text-red-500">{errors.role}</div>}
        </div>
        </div>
        </div>
      </form>
    </div>
  );
}

//grid grid-cols-2 gap-4
