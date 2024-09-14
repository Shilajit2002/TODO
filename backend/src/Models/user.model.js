// Import Mongoose
const mongoose = require('mongoose');
// Import Validator
const validator = require('validator');

// Create User Schema
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email ID !!");
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    pic: {
        type: String
    },
    mode: {
        type: Boolean,
        default: true
    }
})

// Create User Collection
const User = mongoose.model("users", userSchema);

// Exports User Module
module.exports = User;