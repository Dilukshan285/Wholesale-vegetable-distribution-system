import React, { useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const PickupRequestListCount = ({ setTotalRequests }) => {
  const token = localStorage.getItem('farmerToken');
  let farmerNIC = '';

  // Decode token to get farmer NIC
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      farmerNIC = decodedToken.nic;
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  // Fetch pickup requests and set the total count
  useEffect(() => {
    if (farmerNIC) {
      axios
        .get(`http://localhost:3001/pickup-request/pickupRequests`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setTotalRequests(response.data.length); // Set the total number of requests
        })
        .catch((error) => {
          console.error('Error fetching pickup requests:', error);
        });
    }
  }, [farmerNIC, token, setTotalRequests]);

  return null; // Don't render anything in this component
};

export default PickupRequestListCount;
