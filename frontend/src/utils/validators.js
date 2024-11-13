// src/utils/validators.js

export const validateFarmerData = (data) => {
    const errors = [];
  
    if (!data) {
      errors.push("No data provided for validation.");
      return errors;
    }
  
    if (!data.firstName || !data.lastName) {
      errors.push("First Name and Last Name are required.");
    }
  
    if (!data.DOB || isNaN(Date.parse(data.DOB))) {
      errors.push("Invalid Date of Birth.");
    }
  
    if (isNaN(data.age) || data.age <= 0) {
      errors.push("Age must be a positive number.");
    }
  
    if (!data.gender) {
      errors.push("Gender is required.");
    }
  
    if (!data.NIC || data.NIC.length !== 10) {
      errors.push("NIC should be 10 characters long.");
    }
  
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      errors.push("Invalid email format.");
    }
  
    if (!data.contact || !/^\d{10}$/.test(data.contact)) {
      errors.push("Contact must be a 10-digit number.");
    }
  
    
  
    return errors;
  };
  