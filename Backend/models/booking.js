// booking.js
const mongoose = require('mongoose');

// Define the booking schema
const bookingSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        match: /^\d{10}$/ // Enforces 10-digit format for phone numbers
    },
    emailAddress: {
        type: String,
        required: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Basic email validation
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    guardianName: {
        type: String,
        required: true,
        trim: true
    },
    guardianPhoneNumber: {
        type: String,
        required: true,
        match: /^\d{10}$/ // Enforces 10-digit format for guardian's phone number
    },
    bookingDate: {
        type: Date,
        default: Date.now // Automatically set to current date/time
    }
});

// Export the Booking model
module.exports = mongoose.model('Booking', bookingSchema);
