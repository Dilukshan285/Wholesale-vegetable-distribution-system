const router = require('express').Router();
let Driver = require('../models/Driver');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get token from Authorization header
  
  if (!token) {
    return res.status(401).send({ message: 'Token not provided' }); // Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({ message: 'Token invalid or expired' }); // Forbidden
    }
    req.user = user; // Save the user information in request object
    next(); // Proceed to the next middleware/route handler
  });
};

module.exports = authenticateToken;

router.route('/add').post((req, res) => {
  const name = req.body.name;
  const nic = req.body.nic;
  const licenseNo = req.body.licenseNo;
  const licenseExpDate = req.body.licenseExpDate;
  const mobileNo = Number(req.body.mobileNo);
  const email = req.body.email;
  const password = req.body.password;

  const newDriver = new Driver({
    name,
    nic,
    licenseNo,
    licenseExpDate,
    mobileNo,
    email,
    password,
  });

  newDriver.save()
    .then(() => res.json("Driver added"))
    .catch((err) => {
      console.log(err);
    });
});

router.route("/").get((req, res) => {
  Driver.find().then((drivers) => {
    res.json(drivers);
  }).catch((err) => {
    console.log(err);
  });
});

router.route("/update/:driverid").put(async (req, res) => {
  let driverid = req.params.driverid;
  const { name, nic, licenseNo, licenseExpDate, mobileNo, email, password } = req.body;

  const updateDriver = {
    name,
    nic,
    licenseNo,
    licenseExpDate,
    mobileNo,
    email,
    password,
  };

  try {
    const update = await Driver.findByIdAndUpdate(driverid, updateDriver, { new: true });
    if (update) {
      res.status(200).send({ status: 'updated', driver: update });
    } else {
      res.status(404).send({ status: 'Driver not found' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: 'Error with updating', error: err.message });
  }
});

router.route("/delete/:driverid").delete(async (req, res) => {
  let userId = req.params.driverid;

  await Driver.findByIdAndDelete(userId).then(() => {
    res.status(200).send({ status: 'success' });
  }).catch(err => {
    console.log(err);
    res.status(500).send({ status: 'error' });
  });
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const driver = await Driver.findOne({ email });
    if (!driver) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (password !== driver.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: driver._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, driver });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id); // req.user is set by authenticateToken middleware
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    res.json(driver); // Return driver's details
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
