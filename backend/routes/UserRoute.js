const express = require("express");
const {
  resendOtp,
  signin,
  signup,
  verifyUser,
  google,
  requestOtp,
  verifyOtpForPasswordReset,
  resetPassword,
  recovery_resendOTP,
  add_employee,
  login_employee,
} = require("../controller/User.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/verify", verifyUser);
router.post("/resend/otp", resendOtp);
router.post("/signin", signin);
router.post("/google", google);
router.post("/requestOtp", requestOtp);
router.post("/verifyOtp", verifyOtpForPasswordReset);
router.post("/recovery/otp", recovery_resendOTP);
router.put("/resetPassword", resetPassword);
router.post("/add-employee", add_employee);
router.post("/login-employee", login_employee);

module.exports = router;
