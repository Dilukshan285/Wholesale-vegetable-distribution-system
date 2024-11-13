const jwt = require('jsonwebtoken');

// Function to generate token
const generateToken = (farmer) => {
    return jwt.sign(
        { NIC: farmer.NIC },  // Include NIC in the payload
        'your_secret_key',       // Replace with your actual secret key
        { expiresIn: '1h' }    // Token expiry time
    );
};

// Example usage on farmer login
const token = generateToken(farmer);
res.json({ token });
