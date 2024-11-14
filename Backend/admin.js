const express = require('express');
const router = express.Router();

// Admin credentials
const adminEmail = 'sharathnellaya@gmail.com';
const adminPassword = 'Sarath@2001';

// Admin login route
router.post('/admin/login', (req, res) => {
    const { email, password } = req.body;

    // Check if the email and password match the admin's credentials
    if (email === adminEmail && password === adminPassword) {
        // Admin login successful
        return res.status(200).json({ message: 'Admin login successful', user: 'Admin', isAdmin: true });
    } else {
        // Invalid credentials for admin
        return res.status(400).json({ message: 'Invalid admin credentials' });
    }
});

// Admin-specific route example (protected)
router.get('/admin/dashboard', (req, res) => {
    // Here you can add logic for admin-only pages like a dashboard or settings
    res.send('Welcome to the admin dashboard');
});

module.exports = router;
