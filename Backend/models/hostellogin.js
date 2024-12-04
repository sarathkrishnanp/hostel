const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the schema for hostel owner login
const hostelLoginSchema = new mongoose.Schema({
    hostelName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    referenceId: { type: String, required: true },
    password: { type: String, required: true },
});

// Pre-save middleware to hash passwords
hostelLoginSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Export the model
module.exports = mongoose.model('HostelLogin', hostelLoginSchema);
