const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const staffSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },

    lastName: {
      type: String,
      required: true
    },

    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },

    nic: {
        type: String,
        required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    address: {
      type: String,
      required: true
    },

    district: {
      type: String,
      required: true
    },

    contactNumber: {
        type: String,
        required: true
    },

    dob: {
        type: Date,
        required: true
    },

    role: {
      type: String,
      enum: ["WSS", "WMS"],
      required: true
    },

    employeeId: { //auto-generated
      type: String,
      unique: true
    }

})

staffSchema.pre('save', function(next) {
  const doc = this;

  if (!doc.employeeId) {
    let roleCode = '';

    switch (doc.role) {
      case 'WSS':
        roleCode = 'WS';
        break;
      case 'WMS':
        roleCode = 'WM';
        break;
      default:
        roleCode = 'XX'; // Fallback code
    }

    // Extract the last two digits of the birth year
    const birthYear = new Date(doc.dob).getFullYear();
    const lastTwoDigitsOfYear = birthYear.toString().slice(-2);

    // Generate a UUID and use the first 6 characters
    const uuid = uuidv4().split('-')[0].slice(0, 6);
    doc.employeeId = `${roleCode}${lastTwoDigitsOfYear}${uuid}`;
  }

  next();
});

const StaffMember = mongoose.model("staffmember", staffSchema);
module.exports = StaffMember;