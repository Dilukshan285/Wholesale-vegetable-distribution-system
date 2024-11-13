import React, { useState, useEffect } from 'react';
import axios from 'axios';

// AddFuelPurchaseRecord Component (now merged)
const AddFuelPurchaseRecord = ({ nic }) => {
  return (
    <div>
      <label htmlFor="nic" className="flex flex-col">
        Driver NIC
        <input
          type="text"
          id="nic"
          value={nic}
          readOnly // Pre-filled and read-only
          className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>
    </div>
  );
};

// Main DriverPage Component
const DriverPage = () => {
  const driverNic = localStorage.getItem('driverNic'); // Fetch NIC from localStorage
  console.log('Driver NIC:', driverNic);
  
  const [formData, setFormData] = useState({
    registerNo: '',
    mileage: '',
    liters: '',
    cost: ''
  });

  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [currentMileage, setCurrentMileage] = useState(null);
  const [errors, setErrors] = useState({
    registerNoError: '',
    mileageError: '',
  });

  const [message, setMessage] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const driversResponse = await axios.get('http://localhost:3001/driver');
        const vehiclesResponse = await axios.get('http://localhost:3001/vehicle');
        
        setDrivers(driversResponse.data);
        setVehicles(vehiclesResponse.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const validateVehicleRegistration = (registrationNo) => {
    const selectedVehicle = vehicles.find(vehicle => vehicle.registrationNo === registrationNo);
    if (selectedVehicle) {
      setCurrentMileage(selectedVehicle.mileage); // Set the current mileage of the selected vehicle
      return true;
    }
    return false;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    // Real-time validation for mileage
    if (name === 'registerNo') {
      const isValidRegistration = validateVehicleRegistration(value);
      setErrors(prev => ({
        ...prev,
        registerNoError: isValidRegistration ? '' : 'Vehicle registration number not found'
      }));
    }

    if (name === 'mileage') {
      const inputMileage = Number(value);
      if (currentMileage !== null && inputMileage <= currentMileage) {
        setErrors(prev => ({
          ...prev,
          mileageError: `Mileage must be greater than the current mileage (${currentMileage} km)`
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          mileageError: ''
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!errors.registerNoError && !errors.mileageError) {
      try {
        const response = await axios.post('http://localhost:3001/fuelpurchase/add', {
          driverNic, // Include the driver NIC from localStorage
          ...formData,
        });
        setMessage(response.data);
        setFormData({
          registerNo: '',
          mileage: '',
          liters: '',
          cost: ''
        });
        setCurrentMileage(null); // Reset current mileage
      } catch (err) {
        console.error(err);
        setMessage('Error adding fuel purchase record.');
      }
    } else {
      setMessage('Please check before submitting.');
    }
  };

  return (
    <div className="w-full mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-lg overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Add Fuel Purchase Record</h2>
      

      
        <form onSubmit={handleSubmit} className="space-y-4">
          <AddFuelPurchaseRecord nic={driverNic} />
          
          <div>
            <label className="flex flex-col">
              Vehicle Registration Number:
              <select
                name="registerNo"
                value={formData.registerNo}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Select a vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.registrationNo} value={vehicle.registrationNo}>
                    {vehicle.registrationNo}
                  </option>
                ))}
              </select>
              {errors.registerNoError && <p className="error text-red-500">{errors.registerNoError}</p>}
            </label>
          </div>

          <div>
            <label className="flex flex-col">
              Mileage (Km):
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.mileageError && <p className="error text-red-500">{errors.mileageError}</p>}
            </label>
          </div>

          <div>
            <label className="flex flex-col">
              Liters:
              <input
                type="number"
                name="liters"
                value={formData.liters}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>
          <div>
            <label className="flex flex-col">
              Cost (LKR):
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>
          <button 
            type="submit" 
            className="w-full p-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200"
          >
            Submit
          </button>
        </form>
      

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default DriverPage;
