const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const qaTeamSchema = new Schema({
    name: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                // Ensure name has only letters and two or more words
                return /^[A-Za-z]+(\s+[A-Za-z]+)+$/.test(v);
            },
            message: 'Name must have at least two words.'
        }
    },
    
    NIC: {
        type: String,
        required: true
    },
    
    role: {
        type: String,
        enum: ["QA-Team", "QA-Manager"]
    },
    contactInfo: {
        email: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: 'Invalid email format.'
            }
        },
        phone: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    return /^\d{10}$/.test(v);
                },
                message: 'Phone number must have 10 digits.'
            }
        }
    },
    address: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
    },
    dateJoined: {
        type: Date,
        default: Date.now
    },
    birthDay: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                const today = new Date();
                const birthDate = new Date(value);
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return age >= 18;
            },
            message: 'Must be at least 18 years old.'
        }
    },
    password: {
        type: String,
        required: true,
    },

    // Add Gender field
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    }
});

// Virtual for calculating age
qaTeamSchema.virtual('age').get(function () {
    const today = new Date();
    const birthDate = new Date(this.birthDay);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});

// Password hashing middleware before saving
qaTeamSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Middleware for hashing password on update
qaTeamSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    if (update.password) {
        const salt = await bcrypt.genSalt(10);
        update.password = await bcrypt.hash(update.password, salt);
    }
    next();
});

// Ensure virtual fields are included in JSON and object outputs
qaTeamSchema.set('toJSON', { virtuals: true });
qaTeamSchema.set('toObject', { virtuals: true });

const QATeam = mongoose.model("QATeam", qaTeamSchema);

module.exports = QATeam;
