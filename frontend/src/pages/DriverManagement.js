import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDriverId, setEditingDriverId] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility
  const [formData, setFormData] = useState({
    name: '',
    nic: '',
    licenseNo: '',
    licenseExpDate: '',
    mobileNo: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({
    nic: '',
    licenseNo: '',
    licenseExpDate: '',
    mobileNo: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = () => {
    axios.get('http://localhost:3001/driver/')
      .then(response => {
        setDrivers(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the Driver data!', error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobileNo' && value.length > 11) {
      return; // Prevent further input if length exceeds 4
    }
    if (name === 'licenseNo' && value.length > 8) {
      return; // Prevent further input if length exceeds 4
    }
    if (name === 'nic' && value.length > 12) {
      return; // Prevent further input if length exceeds 4
    }
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    validateInput(name, value);
  };

  const validateInput = (name, value) => {
    let error = '';

    if (name === 'name') {
      const lettersAndSpacesPattern = /^[A-Za-z]+( [A-Za-z]+)*$/;
      if (!lettersAndSpacesPattern.test(value)) {
        error = 'Invalid input. single spaces between words are allowed.';
      }
    } else if (name === 'nic') {
      const oldNICRegex = /^[0-9]{9}[Vv]$/;
      const newNICRegex = /^[0-9]{12}$/;
      const currentYear = new Date().getFullYear();

      let birthYear;
      const maxAge = 60;
      const minAge = 18;

      if (oldNICRegex.test(value)) {
        const firstTwoDigits = parseInt(value.slice(0, 2), 10);
        birthYear = (firstTwoDigits > currentYear % 100 ? 1900 : 2000) + firstTwoDigits;
      } else if (newNICRegex.test(value)) {
        birthYear = parseInt(value.slice(0, 4), 10);
      } else {
        error = 'Invalid NIC format.';
      }

      const age = currentYear - birthYear;
      if (age < minAge) {
        error = 'Person must be at least 18 years old.';
      } else if (age > maxAge) {
        error = 'Person must be over 60 years old. Not valid';
      }
    } else if (name === 'licenseNo') {
      if (!/^[B][0-9]{5,7}$/.test(value)) {
        error = 'Invalid license number format.';
      }
    } else if (name === 'licenseExpDate') {
      const today = new Date();
      const selectedDate = new Date(value);
      if (selectedDate < today) {
        error = 'License expiration date cannot be in the past.';
      }
    } else if (name === 'mobileNo') {
      if (!/^94\d{9}$/.test(value)) {
        error = 'Mobile number must start with 94 and have 11 digits in total. Eg: 94XXXXXXXXX';
      }
    } else if (name === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = 'Invalid email format.';
      }
    } else if (name === 'password') {
      if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/.test(value)) {
        error = 'Password must be at least 8 characters long, and include one uppercase letter, one number, and one special character.';
      }
    } else if (name === 'confirmPassword') {
      if (value !== formData.password) {
        error = 'Passwords do not match.';
      }
    }

    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingDriverId) {
      axios.put(`http://localhost:3001/driver/update/${editingDriverId}`, formData)
        .then(response => {
          fetchDrivers();
          setShowForm(false);
          setEditingDriverId(null);
          resetForm();
        })
        .catch(error => {
          console.error('There was an error updating the driver!', error);
        });
    } else {
      axios.post('http://localhost:3001/driver/add', formData)
        .then(response => {
          fetchDrivers();
          setShowForm(false);
          resetForm();
        })
        .catch(error => {
          console.error('There was an error adding the driver!', error);
        });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nic: '',
      licenseNo: '',
      licenseExpDate: '',
      mobileNo: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleEdit = (driver) => {
    setFormData({ ...driver, confirmPassword: driver.password });
    setEditingDriverId(driver._id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this Driver account?')) {
      axios.delete(`http://localhost:3001/driver/delete/${id}`)
        .then(response => {
          fetchDrivers();
        })
        .catch(error => {
          console.error('There was an error deleting the driver!', error);
        });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString) ;
    return date.toLocaleDateString('en-GB');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.nic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.licenseNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-lg overflow-auto">
      <main >
        <h2 className="text-2xl font-bold mb-4">Driver Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          {showForm ? 'Cancel' : 'Register a Driver'}
        </button>

        <input
          type="text"
          placeholder="Search by Name or NIC"
          value={searchQuery}
          onChange={handleSearchChange}
          className="mb-4 p-2 border rounded w-full"
        />

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-4">
            <div>
              <label className="block">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => {
                  // Check if the input value contains any numbers
                  if (!/\d/.test(e.target.value)) {
                    handleInputChange(e);
                  }
                }}
                className="p-2 border rounded w-full"
              />
              {errors.name && <span className="text-red-500">{errors.name}</span>}
            </div>

            <div>
              <label className="block">NIC:</label>
              <input
                type="text"
                name="nic"
                value={formData.nic}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
              {errors.nic && <span className="text-red-500">{errors.nic}</span>}
            </div>

            <div>
              <label className="block">License No:</label>
              <input
                type="text"
                name="licenseNo"
                value={formData.licenseNo}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
              {errors.licenseNo && <span className="text-red-500">{errors.licenseNo}</span>}
            </div>

            <div>
              <label className="block">License Expiry Date:</label>
              <input
                type="date"
                name="licenseExpDate"
                value={formData.licenseExpDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="p-2 border rounded w-full"
              />
              {errors.licenseExpDate && <span className="text-red-500">{errors.licenseExpDate}</span>}
            </div>

            <div>
              <label className="block">Mobile No:</label>
              <input
                type="number"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
              {errors.mobileNo && <span className="text-red-500">{errors.mobileNo}</span>}
            </div>

            <div>
              <label className="block">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
              {errors.email && <span className="text-red-500">{errors.email}</span>}
            </div>

            <div>
              <label className="block">Password:</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="p-2 border rounded w-full pr-10" // Add padding to right for icon
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-3 cursor-pointer"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
              </div>
              {errors.password && <span className="text-red-500">{errors.password}</span>}
            </div>

            <div>
              <label className="block">Confirm Password:</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="p-2 border rounded w-full pr-10" // Add padding to right for icon
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-3 cursor-pointer"
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </span>
              </div>
              {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword}</span>}
            </div>

            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
              disabled={Object.values(errors).some(error => error)}
            >
              {editingDriverId ? 'Update Driver' : 'Register Driver'}
            </button>
          </form>
        )}

        <table className="w-full table-auto border-collapse mb-6">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">NIC</th>
              <th className="px-4 py-2 border">License No</th>
              <th className="px-4 py-2 border">License Expiry</th>
              <th className="px-4 py-2 border">Mobile No</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.map(driver => (
              <tr key={driver._id} >
                <td className="px-4 py-2 border">{driver.name}</td>
                <td className="px-4 py-2 border">{driver.nic}</td>
                <td className="px-4 py-2 border">{driver.licenseNo}</td>
                <td className="px-4 py-2 border">{formatDate(driver.licenseExpDate)}</td>
                <td className="px-4 py-2 border">{driver.mobileNo}</td>
                <td className="px-4 py-2 border">{driver.email}</td>
                <td className="px-4 py-2 border">
                  <button onClick={() => handleEdit(driver)} className=" ml-2 bg-yellow-500 text-white px-2 py-1 rounded">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(driver._id)} className="bg-red-500 text-white px-2 py-1 rounded ml-2">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default DriverManagement;
