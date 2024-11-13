import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FarmerProfile = ({ userId }) => {
    const [farmer, setFarmer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:3001/farmer/get/userId")
            .then((response) => {
                setFarmer(response.data.farmer);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching farmer data:', error);
                setLoading(false);
            });
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!farmer) {
        return <div>Farmer data not found.</div>;
    }

    return (
        <div>
            <h2>{farmer.firstName} {farmer.lastName}</h2>
            <p>DOB: {new Date(farmer.DOB).toLocaleDateString()}</p>
            <p>Age: {farmer.age}</p>
            <p>Email: {farmer.email}</p>
            <p>Phone: {farmer.phone}</p>
            <h3>Land Information</h3>
            
        </div>
    );
};

export default FarmerProfile;
