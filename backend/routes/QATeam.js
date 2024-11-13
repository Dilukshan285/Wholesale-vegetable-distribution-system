const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const QATeam = require("../models/QATeam");
const passwordGenerator = require("generate-password");
const nodemailer = require("nodemailer");
const cookieParser = require("cookie-parser");

router.use(cookieParser());

// Create transporter for nodemailer (using Gmail in this example)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.QAEMAIL_USER, // Your email address (set in .env)
    pass: process.env.QAEMAIL_PASS  // Your email password (set in .env)
  }
});

// Route to add a new QA team member
router.post("/add", async (req, res) => {
  const { name, NIC, contactInfo, birthDay, address, role, gender } = req.body;

  try {
    // Check if email, NIC, or phone already exists in the database
    const existingMember = await QATeam.findOne({
      $or: [
        { "contactInfo.email": contactInfo.email },
        { NIC: NIC },
        { "contactInfo.phone": contactInfo.phone },
      ],
    });

    if (existingMember) {
      if (existingMember.NIC === NIC) {
        return res.status(400).json({ message: "NIC already exists." });
      }
      if (existingMember.contactInfo.phone === contactInfo.phone) {
        return res.status(400).json({ message: "Phone number already exists." });
      }
      if (existingMember.contactInfo.email === contactInfo.email) {
        return res.status(400).json({ message: "Email already exists." });
      }
    }

    // Generate a random password
    const password = passwordGenerator.generate({
      length: 12,
      numbers: true,
      uppercase: true,
      lowercase: true,
      symbols: true,
      excludeSimilarCharacters: true,
    });

    const newQATeamMember = new QATeam({
      password,
      name,
      NIC,
      contactInfo,
      birthDay,
      address,
      role,
      gender,
    });

    await newQATeamMember.save();

    // Send email with the password
    const mailOptions = {
      from: process.env.EMAIL_USER,  // Sender email
      to: contactInfo.email,         // Receiver email
      subject: "Your Account Has Been Created",
      text: `Hello ${name},\n\nYour QA Team account has been created. Here are your login credentials:\n\nEmail: ${contactInfo.email}\nPassword: ${password}\n\nPlease change your password after logging in.\n\nBest regards,\nQA Team`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Error sending email", error: error.toString() });
      } else {
        res.json({
          message: "QA Team Member added successfully! Email with credentials has been sent.",
          info: info.response
        });
      }
    });
  } catch (err) {
    // Handle validation errors specifically
    if (err.name === "ValidationError") {
      const firstErrorMessage = Object.values(err.errors)[0].message;
      return res.status(400).json(firstErrorMessage);  // Send just the message
    }

    res.status(500).json("Internal server error");
  }
});

// Route to get all QA team members
router.get("/", async (req, res) => {
  try {
    const members = await QATeam.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: "Error: " + err });
  }
});

// Route to get a specific QA team member by ID
router.get("/get/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const member = await QATeam.findById(id);
    if (!member) {
      return res.status(404).json({ error: "QA Team Member not found" });
    }
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: "Error: " + err });
  }
});

// Route to update a specific QA team member by ID
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, NIC, contactInfo, birthDay, address, role, gender } = req.body;

  try {
    const member = await QATeam.findById(id);
    if (!member) {
      return res.status(404).json({ error: "QA Team Member not found" });
    }

    // Check if email, NIC, or phone already exists in another member
    const existingMember = await QATeam.findOne({
      $or: [
        { "contactInfo.email": contactInfo.email },
        { NIC: NIC },
        { "contactInfo.phone": contactInfo.phone },
      ],
      _id: { $ne: id }  // Exclude the current member from the check
    });

    if (existingMember) {
      return res.status(400).json("Email, NIC, or phone number already exists.");
    }

    // Update fields
    member.name = name;
    member.NIC = NIC;
    member.contactInfo = contactInfo;
    member.birthDay = birthDay;
    member.address = address;
    member.role = role;
    member.gender = gender;

    const updatedMember = await member.save();
    res.json({ message: "QA Team Member updated successfully!", updatedMember });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        error: "Validation failed",
        message: messages.join(", ")  // Join multiple error messages if any
      });
    }

    res.status(500).json({ error: "Internal server error", message: err.message });
  }
});

// Route to delete a specific QA team member by ID
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const member = await QATeam.findByIdAndDelete(id);
    if (!member) {
      return res.status(404).json({ error: "QA Team Member not found" });
    }
    res.json({ message: "QA Team Member deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Error: " + err });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const member = await QATeam.findOne({ "contactInfo.email": email });
    if (!member) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("Logging in member:", member); // Debugging line

    // Store the email in the cookie instead of the memberId
    res.cookie("qaMemberEmail", email, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000  // 1 day expiration
    });

    res.json({ message: "Login successful", email });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// Example route to check if user is logged in based on cookie
// Route to get the logged-in QA team member by email (from cookie)
router.get("/me", async (req, res) => {
  const { qaMemberEmail } = req.cookies;

  if (!qaMemberEmail) {
    return res.status(401).json({ message: "Not logged in" });
  }

  try {
    const member = await QATeam.findOne({ "contactInfo.email": qaMemberEmail });
    if (!member) {
      return res.status(404).json({ message: "QA Team Member not found" });
    }

    res.json({ message: "Member found", member });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});




module.exports = router;
