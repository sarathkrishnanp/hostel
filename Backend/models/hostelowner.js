const mongoose = require('mongoose');

const hostelOwnerSchema = new mongoose.Schema({
    referenceId: {
        type: String,  // Store reference ID as a string
        required: true, // Ensure reference ID is always present
        unique: true    // Ensure reference ID is unique
    },
    hostelName: {
        type: String,
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    rooms: {
        type: Number,
        required: true
    },
    rent: {
        type: Number,
        required: true
    }
});

// Create a model from the schema
const HostelOwner = mongoose.model('HostelOwner', hostelOwnerSchema);

module.exports = HostelOwner;
