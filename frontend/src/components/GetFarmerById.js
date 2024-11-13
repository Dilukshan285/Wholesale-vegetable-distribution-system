import React, { useState } from 'react';
import axios from 'axios';

function GetFarmerById() {
  const [farmerId, setFarmerId] = useState("");
  const [farmerData, setFarmerData] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    axios.get(`http://localhost:3001/farmer/get/${farmerId}`)
      .then((res) => {
        setFarmerData(res.data.farmer);
        setError("");  // Clear any previous errors
      })
      .catch((err) => {
        setFarmerData(null);
        setError("Farmer not found or error fetching data");
      });
  };

  return (
    <div className="containert">
      <h2>Retrieve Farmer Details by ID</h2>
      <form onSubmit={handleSearch} className="container4t">
        <div className="mb-3">
          <label htmlFor="farmerId" className="form-label">Farmer ID</label>
          <input
            type="text"
            className="form-control"
            id="farmerId"
            value={farmerId}
            onChange={(e) => setFarmerId(e.target.value)}
            placeholder="Enter Farmer ID"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {error && <p className="text-danger">{error}</p>}

      {farmerData && (
        <div className="mt-4">
          <h3>Farmer Details</h3>
          <p><strong>First Name:</strong> {farmerData.firstName}</p>
          <p><strong>Last Name:</strong> {farmerData.lastName}</p>
          <p><strong>Date of Birth:</strong> {new Date(farmerData.DOB).toLocaleDateString()}</p>
          <p><strong>Age:</strong> {farmerData.age}</p>
          <p><strong>Gender:</strong> {farmerData.gender}</p>
          <p><strong>NIC:</strong> {farmerData.NIC}</p>
          <p><strong>Address:</strong> {farmerData.address}</p>
          <p><strong>Email:</strong> {farmerData.email}</p>
          <p><strong>Contact:</strong> {farmerData.contact}</p>
        </div>
      )}
    </div>
  );
}

export default GetFarmerById;
