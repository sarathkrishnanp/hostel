// const express = require('express');
// const router = express.Router();
// const Booking = require('./models/booking'); // Adjust path as needed

// // Define your booking routes here

// // Example booking route
// router.post('/book', async (req, res) => {
//     // Logic to handle booking
//     const bookingData = req.body;
//     const newBooking = new Booking(bookingData);
    
//     try {
//         await newBooking.save();
//         res.status(201).json({ message: 'Booking successful', booking: newBooking });
//     } catch (err) {
//         console.error('Error during booking:', err);
//         res.status(500).json({ message: 'Booking error' });
//     }
// });

// module.exports = router;
