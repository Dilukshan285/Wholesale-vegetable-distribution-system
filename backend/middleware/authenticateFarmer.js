const jwt = require('jsonwebtoken');

const authenticateFarmer = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Token in Request:", authHeader);


  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.FARMER_JWT_SECRET);  // Ensure JWT_SECRET is correct
    req.user = { id: decoded.farmerId, nic: decoded.nic  };  // Attach farmer ID to req.user
    next();  // Call next() to move on to the route handler
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateFarmer;
