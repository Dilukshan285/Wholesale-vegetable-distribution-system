// src/components/LandList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LandList = () => {
  const [lands, setLands] = useState([]);

  useEffect(() => {
    const fetchLands = async () => {
      try {
        const response = await axios.get('http://localhost:3001/land/list');
        setLands(response.data);
      } catch (error) {
        console.error('Error fetching lands:', error);
      }
    };
    fetchLands();
  }, []);

  return (
    <div>
      <h1>Land List</h1>
      <ul>
        {lands.map((land) => (
          <li key={land._id}>
            Location: {land.location}, Size: {land.size}, Type: {land.type}
            <button onClick={() => window.location.href=`/admin/land/view/${land._id}`}>View</button>
            <button onClick={() => window.location.href=`/admin/land/update/${land._id}`}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LandList;
