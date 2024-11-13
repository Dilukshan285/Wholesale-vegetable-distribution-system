import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateStaff() {
  const [staffMember, setStaffMember] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    nic: '',
    email: '',
    address: '',
    district: '',
    contactNumber: '',
    dob: '',
    role: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Fetch the staff member's current data
    axios
      .get(`http://localhost:3001/staff/get-staff/${id}`)
      .then((res) => {
        setStaffMember(res.data.staff);
      })
      .catch((err) => {
        console.error(err);
        alert('An error occurred while fetching staff details.');
      });
  }, [id]);

  // Validation functions
  const validateName = (name) => {
    const namePattern = /^[a-zA-Z\s]+$/;
    return namePattern.test(name) ? null : 'Name cannot contain numbers or special characters.';
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
      return 'Invalid NIC format.';
    }

    if (
      (gender === 'Male' && daysFromJan1 >= 500) ||
      (gender === 'Female' && daysFromJan1 < 500)
    ) {
      return 'NIC does not match with the selected gender.';
    }

    return null;
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email) ? null : 'Invalid email format.';
  };

  const validateAddress = (address) => {
    const addressPattern = /^[^,]+,\s*[^,]+,\s*[^,]+$/;
    return addressPattern.test(address) ? null : 'Invalid address format.';
  };

  const validateContactNumber = (contactNumber) => {
    const contactNumberPattern = /^07[0-9]{8}$/;
    return contactNumberPattern.test(contactNumber) ? null : 'Invalid contact number.';
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

  const validateDob = (dob, nic) => {
    const currentYear = new Date().getFullYear();
    const birthYear = getBirthYearFromNIC(nic);
    if (!birthYear) {
      return 'Invalid NIC for date of birth validation.';
    }
    return currentYear - birthYear >= 18 && currentYear - birthYear <= 60
      ? null
      : 'Employee must be above 18 and below 60 years old.';
  };

  const validateForm = () => {
    const newErrors = {};

    if (!staffMember.firstName) newErrors.firstName = 'First name is required.';
    else {
      const firstNameError = validateName(staffMember.firstName);
      if (firstNameError) newErrors.firstName = firstNameError;
    }

    if (!staffMember.lastName) newErrors.lastName = 'Last name is required.';
    else {
      const lastNameError = validateName(staffMember.lastName);
      if (lastNameError) newErrors.lastName = lastNameError;
    }

    if (!staffMember.gender) newErrors.gender = 'Gender is required.';
    if (!staffMember.district) newErrors.district = 'District is required.';
    if (!staffMember.role) newErrors.role = 'Role is required.';

    if (!staffMember.nic) newErrors.nic = 'NIC is required.';
    else {
      const nicError = validateNIC(staffMember.nic, staffMember.gender);
      if (nicError) newErrors.nic = nicError;
    }

    if (!staffMember.email) newErrors.email = 'Email is required.';
    else {
      const emailError = validateEmail(staffMember.email);
      if (emailError) newErrors.email = emailError;
    }

    if (!staffMember.address) newErrors.address = 'Address is required.';
    else {
      const addressError = validateAddress(staffMember.address);
      if (addressError) newErrors.address = addressError;
    }

    if (!staffMember.contactNumber) newErrors.contactNumber = 'Contact number is required.';
    else {
      const contactNumberError = validateContactNumber(staffMember.contactNumber);
      if (contactNumberError) newErrors.contactNumber = contactNumberError;
    }

    if (!staffMember.dob) newErrors.dob = 'Date of birth is required.';
    else {
      const dateOfBirthError = validateDob(staffMember.dob, staffMember.nic);
      if (dateOfBirthError) newErrors.dob = dateOfBirthError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedStaffMember = {
      ...staffMember,
      [name]: value,
    };

    setStaffMember(updatedStaffMember);

    let updatedErrors = { ...errors };

    switch (name) {
      case 'firstName':
      case 'lastName':
        const nameError = validateName(value);
        if (nameError) updatedErrors[name] = nameError;
        else delete updatedErrors[name];
        break;
      case 'nic':
        const nicError = validateNIC(value, updatedStaffMember.gender);
        if (nicError) updatedErrors.nic = nicError;
        else delete updatedErrors.nic;
        // Re-validate dob since nic changed
        if (updatedStaffMember.dob) {
          const dobError = validateDob(updatedStaffMember.dob, value);
          if (dobError) updatedErrors.dob = dobError;
          else delete updatedErrors.dob;
        }
        break;
      case 'gender':
        const nicErrorGender = validateNIC(updatedStaffMember.nic, value);
        if (nicErrorGender) updatedErrors.nic = nicErrorGender;
        else delete updatedErrors.nic;
        break;
      case 'email':
        const emailError = validateEmail(value);
        if (emailError) updatedErrors.email = emailError;
        else delete updatedErrors.email;
        break;
      case 'address':
        const addressError = validateAddress(value);
        if (addressError) updatedErrors.address = addressError;
        else delete updatedErrors.address;
        break;
      case 'contactNumber':
        const contactNumberError = validateContactNumber(value);
        if (contactNumberError) updatedErrors.contactNumber = contactNumberError;
        else delete updatedErrors.contactNumber;
        break;
      case 'dob':
        const dobError = validateDob(value, updatedStaffMember.nic);
        if (dobError) updatedErrors.dob = dobError;
        else delete updatedErrors.dob;
        break;
      default:
        break;
    }

    setErrors(updatedErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    axios
      .put(`http://localhost:3001/staff/update-staff/${id}`, staffMember)
      .then((res) => {
        alert('Staff member updated successfully.');
        navigate('/wh-manager/all-staff'); // Redirect to the staff list
      })
      .catch((err) => {
        console.error(err);
        alert('An error occurred while updating the staff member.');
      });
  };

  const birthYear = getBirthYearFromNIC(staffMember.nic);
  const minDate = birthYear ? `${birthYear}-01-01` : null;
  const maxDate = birthYear ? `${birthYear}-12-31` : null;

  return (
    <div className="max-w-3xl m-3 bg-white p-6 rounded-lg shadow-md flex-auto">
      <h1 className="text-3xl font-bold text-center mb-12">Update Staff Member</h1>
      <form onSubmit={handleSubmit} className="space y-4">
        <div className="grid grid-cols-2 gap-10">
          <div>
            <div className="mb-4">
              <label className="block text-m font-medium text-gray-700 mt-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={staffMember.firstName}
                onChange={handleChange}
                className={`mt-1 block w-full h-12 border-2 border-gray-200 focus:outline-none focus:border-green-500 rounded-md px-3 ${
                  errors.firstName ? 'border-red-500' : ''
                }`}
              />
              {errors.firstName && <div className="text-red-500">{errors.firstName}</div>}
            </div>
            <div className="mb-4">
              <label className="block text-m font-medium text-gray-700 mt-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={staffMember.lastName}
                onChange={handleChange}
                className={`mt-1 block w-full h-12 border-2 border-gray-200 focus:outline-none focus:border-green-500 rounded-md px-3 ${
                  errors.lastName ? 'border-red-500' : ''
                }`}
              />
              {errors.lastName && <div className="text-red-500">{errors.lastName}</div>}
            </div>
            <div className="mb-4">
              <label className="block text-m font-medium text-gray-700 mt-1">Gender</label>
              <select
                name="gender"
                value={staffMember.gender}
                onChange={handleChange}
                className={`mt-1 block w-full h-12 border-2 border-gray-200 focus:border-green-500 rounded-md px-3 ${
                  errors.gender ? 'border-red-500' : ''
                }`}
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && <div className="text-red-500">{errors.gender}</div>}
            </div>
            <div className="mb-4">
              <label className="block text-m font-medium text-gray-700 mt-1">NIC</label>
              <input
                type="text"
                name="nic"
                value={staffMember.nic}
                onChange={handleChange}
                className={`mt-1 block w-full h-12 border-2 border-gray-200 focus:outline-none focus:border-green-500 rounded-md px-3 ${
                  errors.nic ? 'border-red-500' : ''
                }`}
              />
              {errors.nic && <div className="text-red-500">{errors.nic}</div>}
            </div>
            <div className="mb-4">
              <label className="block text-m font-medium text-gray-700 mt-1">Email</label>
              <input
                type="email"
                name="email"
                value={staffMember.email}
                onChange={handleChange}
                className={`mt-1 block w-full h-12 border-2 border-gray-200 focus:outline-none focus:border-green-500 rounded-md px-3 ${
                  errors.email ? 'border-red-500' : ''
                }`}
              />
              {errors.email && <div className="text-red-500">{errors.email}</div>}
            </div>
            <button
              type="submit"
              className="w-full h-12 bg-[#23b725] text-white font-semibold rounded-md hover:bg-green-600 transition duration-200 mt-6"
            >
              Update Staff Member
            </button>
          </div>
          <div>
            <div className="mb-4">
              <label className="block text-m font-medium text-gray-700 mt-1">
                Address (Number, Street, City)
              </label>
              <input
                type="text"
                name="address"
                value={staffMember.address}
                onChange={handleChange}
                className={`mt-1 block w-full h-12 border-2 border-gray-200 focus:outline-none focus:border-green-500 rounded-md px-3 ${
                  errors.address ? 'border-red-500' : ''
                }`}
              />
              {errors.address && <div className="text-red-500">{errors.address}</div>}
            </div>
            <div className="mb-4">
              <label className="block text-m font-medium text-gray-700 mt-1">District</label>
              <select
                name="district"
                value={staffMember.district}
                onChange={handleChange}
                className={`mt-1 block w-full h-12 border-2 border-gray-200 focus:border-green-500 rounded-md px-3 ${
                  errors.district ? 'border-red-500' : ''
                }`}
              >
                <option value="" disabled>
                  Choose an option
                </option>
                {/* Add all district options here */}
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
            <div className="mb-4">
              <label className="block text-m font-medium text-gray-700 mt-1">Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                value={staffMember.contactNumber}
                onChange={handleChange}
                className={`mt-1 block w-full h-12 border-2 border-gray-200 focus:outline-none focus:border-green-500 rounded-md px-3 ${
                  errors.contactNumber ? 'border-red-500' : ''
                }`}
              />
              {errors.contactNumber && <div className="text-red-500">{errors.contactNumber}</div>}
            </div>
            <div className="mb-4">
              <label className="block text-m font-medium text-gray-700 mt-1">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={staffMember.dob ? staffMember.dob.substring(0, 10) : ''}
                onChange={handleChange}
                className={`mt-1 block w-full h-12 border-2 border-gray-200 focus:outline-none focus:border-green-500 rounded-md px-3 ${
                  errors.dob ? 'border-red-500' : ''
                }`}
                min={minDate}
                max={maxDate}
              />
              {errors.dob && <div className="text-red-500">{errors.dob}</div>}
            </div>
            <div className="mb-4">
              <label className="block text-m font-medium text-gray-700 mt-1">Role</label>
              <select
                name="role"
                value={staffMember.role}
                onChange={handleChange}
                className={`mt-1 block w-full h-12 border-2 border-gray-200 focus:border-green-500 rounded-md px-3 ${
                  errors.role ? 'border-red-500' : ''
                }`}
              >
                <option value="" disabled>
                  Select Role
                </option>
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
