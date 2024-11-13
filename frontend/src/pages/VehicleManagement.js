import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    registrationNo: '',
    manufacYear: '',
    mileage: '',
    length: '',
    width: '',
    verified: false 
  });
  const [errors, setErrors] = useState({
    registrationNo: '',
    manufacYear: '',
    mileage: '',
    length: '',
    width: '',
    verified: 'checked',
    });
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationError, setVerificationError] = useState('');
  const [showIframe, setShowIframe] = useState(false);
  const [iframeUrl, setIframeUrl] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/vehicle/')
      .then(response => {
        const vehiclesWithYearOnly = response.data.map(vehicle => ({
          ...vehicle,
          manufacYear: new Date(vehicle.manufacYear).getFullYear()
        }));
        setVehicles(vehiclesWithYearOnly);
        setFilteredVehicles(vehiclesWithYearOnly); // Initially display all vehicles
      })
      .catch(error => {
        console.error('There was an error fetching the vehicle data!', error);
      });
  }, []);

  useEffect(() => {
    // Filter vehicles based on search query and selected year
    let filtered = vehicles;

    if (searchQuery) {
      filtered = filtered.filter(vehicle =>
        vehicle.registrationNo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedYear) {
      filtered = filtered.filter(vehicle => vehicle.manufacYear === parseInt(selectedYear));
    }

    setFilteredVehicles(filtered);
  }, [searchQuery, selectedYear, vehicles]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'registrationNo' && value.length > 8) {
      return; // Prevent further input if length exceeds 4
    }
  
    
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    validateInput(name, value);
  };

  const validateInput = (name, value) => {
    let error = '';
  
    if (name === 'registrationNo') {
      const regNoRegex = /^([A-Z]{2,3}|((?!0*-)[0-9]{2,3}))-[0-9]{4}(?<!0{4})$/;
      if (!regNoRegex.test(value)) {
        error = 'Registration No must be in the format XX-1234.';
      }
    } else if (name === 'manufacYear') {
      const currentYear = new Date().getFullYear();
      if (value > currentYear) {
        error = 'Manufacturing Year cannot be in the future.';
      }
    } else if (name === 'mileage') {
      // Validate mileage
      if (isNaN(value) || value < 0) {
        error = 'Mileage must be a positive number.';
      }
    } else if (name === 'length' || name === 'width') {
      // Validate length and width
      if (isNaN(value) || value < 5) {
        error = 'Width and Length must be at least 5.';
      } 
      
      
      if (formData.width > formData.length) {
        error = 'Length must be greater than Width.';
      }
    }
  
    // Update the error state
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
  };
  
  
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(errors).some(error => error)) {
      console.log('Form contains errors.');
      return;
    }

    if (editingVehicleId) {
      axios.put(`http://localhost:3001/vehicle/update/${editingVehicleId}`, formData)
        .then(response => {
          setVehicles(prevVehicles => prevVehicles.map(vehicle =>
            vehicle._id === editingVehicleId ? response.data.vehicle : vehicle
          ));
          setEditingVehicleId(null);
          setShowForm(false);
        })
        .catch(error => {
          console.error('There was an error updating the vehicle!', error);
        });
    } else {
      axios.post('http://localhost:3001/vehicle/add', formData)
        .then(response => {
          axios.get('http://localhost:3001/vehicle/')
            .then(response => {
              const vehiclesWithYearOnly = response.data.map(vehicle => ({
                ...vehicle,
                manufacYear: new Date(vehicle.manufacYear).getFullYear()
              }));
              setVehicles(vehiclesWithYearOnly);
              setShowForm(false);
            })
            .catch(error => {
              console.error('There was an error fetching the updated vehicle data!', error);
            });
        })
        .catch(error => {
          console.error('There was an error adding the vehicle!', error);
        });
    }
  };

  const handleDelete = (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle account?')) {
      axios.delete(`http://localhost:3001/vehicle/delete/${vehicleId}`)
        .then(response => {
          setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle._id !== vehicleId));
        })
        .catch(error => {
          console.error('There was an error deleting the vehicle!', error);
        });
    }
  };

  const handleEdit = (vehicle) => {
    setFormData(vehicle);
    setEditingVehicleId(vehicle._id);
    setShowForm(true);
  };

  const handleVerify = async () => {
    const { registrationNo } = formData;
    const NIC = '663191802v';
    const contactNumber = '0779257741';
    const url = `https://eservices.motortraffic.gov.lk/VehicleInfo/showLimitedInformationEntry.action?nicNumber=${NIC}&contactNumber=${contactNumber}&vehicleRegNo=${registrationNo}`;

    try {
      // Set the URL for the iframe
      setIframeUrl(url);
      setShowIframe(true);

    } catch (error) {
      console.error('Error during verification:', error);
      setVerificationResult('');
      setVerificationError('An error occurred during verification.');
    }
  };

  const handleDone = () => {
    setShowIframe(false);
  };

  return (
    <div className="w-full mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-lg overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Vehicle Management</h2>
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search by Registration No  "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-40 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Filter by Manufacturing Year</option>
            {yearOptions().map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {showForm ? (editingVehicleId ? 'Cancel Edit' : 'Cancel') : (editingVehicleId ? 'Edit Vehicle' : 'Register a Vehicle')}
        </button>
      </div>

      {showForm && (
        <div className="relative">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md mb-6">
            {/* Registration No Input */}
            <label className="block mb-4">
              <span className="text-gray-700">Registration No:</span>
              <input
                type="text"
                name="registrationNo"
                value={formData.registrationNo}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.registrationNo && <span className="text-red-500 text-sm">{errors.registrationNo}</span>}
              {verificationError && <span className="text-red-500 text-sm">{verificationError}</span>}
              
              <br />
              {formData.verified ? (
                <span className="text-green-500">Verified ✔️</span>
              ) : (
                <span className="text-yellow-500">Manual verification is Pending</span>
              )}
              <p
                type="button"
                onClick={handleVerify} 
                className="text-blue-500 cursor-pointer hover:underline">
                Verify From Government
              </p>
              {/* Display "Pending" or "Verified" text */}
              
              {showIframe && (
                <div className="mt-4">
                  <iframe
                    src={iframeUrl}
                    width="100%"
                    height="500"
                    title="Government Verification"
                    className="border rounded-md"
                  />
                  <button
                    onClick={handleDone}
                    disabled={!formData.verified}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Done
                  </button>
                  <label className="block mb-4 flex items-center">
                    <input
                      type="checkbox"
                      name="verified"
                      checked={formData.verified}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Verified?</span>
                  </label>
                </div>
              )}
            </label>
            
            
          
            

            <label className="block mb-4">
            <span className="text-gray-700">Manufacturing Year:</span>
            <select
              name="manufacYear"
              value={formData.manufacYear}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a year</option>
              {yearOptions().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            {errors.manufacYear && <span className="text-red-500 text-sm">{errors.manufacYear}</span>}
          </label>

            <label className="block mb-4">
              <span className="text-gray-700">Mileage(Km):</span>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.mileage && <span className="text-red-500 text-sm">{errors.mileage}</span>}
            </label>

            <label className="block mb-4">
              <span className="text-gray-700">Length(Feet):</span>
              <input
                type="number"
                name="length"
                value={formData.length}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.length && <span className="text-red-500 text-sm">{errors.length}</span>}
            </label>

            <label className="block mb-4">
              <span className="text-gray-700">Width(Feet):</span>
              <input
                type="number"
                name="width"
                value={formData.width}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.width && <span className="text-red-500 text-sm">{errors.width}</span>}
            </label>

            

            

            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {editingVehicleId ? 'Update Vehicle' : 'Register Vehicle'}
            </button>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
      
        <table className="w-full table-auto border-collapse mb-6">
          <thead className="bg-gray-200">
            <tr className="border-b border-gray-300">
              <th className="px-4 py-2 border">Registration No</th>
              <th className="px-4 py-2 border">Manufacturing Year</th>
              <th className="px-4 py-2 border">Mileage(Km)</th>
              <th className="px-4 py-2 border">Length(Feet)</th>
              <th className="px-4 py-2 border">Width(Feet)</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map(vehicle => (
              <tr key={vehicle._id}>
                <td className="px-4 py-2 border">{vehicle.registrationNo}</td>
                <td className="px-4 py-2 border">{vehicle.manufacYear}</td>
                <td className="px-4 py-2 border">{vehicle.mileage}</td>
                <td className="px-4 py-2 border">{vehicle.length}</td>
                <td className="px-4 py-2 border">{vehicle.width}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleEdit(vehicle)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  );
  
};

const yearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1990; year--) {
    years.push(year);
  }
  return years;
};

export default VehicleManagement;
