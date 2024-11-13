// src/components/ViewLand.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ViewLand = () => {
  const [land, setLand] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchLand = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/land/get/${id}`);
        setLand(response.data.land);
      } catch (error) {
        console.error('Error fetching land:', error);
      }
    };
    fetchLand();
  }, [id]);

  if (!land) return <div>Loading...</div>;

  return (
    <div>
      <h1>View Land</h1>
      <p>Location: {land.location}</p>
      <p>Size: {land.size}</p>
      <p>Type: {land.type}</p>
    </div>
  );
};

export default ViewLand;
