const express = require('express');
// const { verifyToken } = require('../middleware/verifyToken.js');
const { updateUserProfile, deleteUser, signout, getUser } = require('../controller/Auth.js');
const verifyToken  = require('../middleware/verifyToken.js');


const router = express.Router();

router.put("/update/:userId", verifyToken, updateUserProfile);
router.delete("/delete/:userId",verifyToken, deleteUser);
router.post('/signout',verifyToken, signout);
router.get('/getUsers',getUser);

module.exports =  router;