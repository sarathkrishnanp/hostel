const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // For password hashing
const User = require('./models/user'); // Ensure this path is correct
const Booking = require('./models/booking'); // Use this directly now
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto'); // For OTP generation
const OTP = require('./models/otp');

// Create an Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data
// Serve static files for the admin dashboard
app.use('/admin', express.static(path.join(__dirname, 'public', 'admin')));

let otpDatabase = {}; // Temporary storage for OTPs

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sharathnellaya@gmail.com',
        pass: 'glggmrtkfbqgamqj'
    }
});

app.post('/generate-otp', async (req, res) => {
    const { email } = req.body;

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Set OTP expiry to 5 minutes from now
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    try {
        // Save OTP to MongoDB
        await OTP.create({ email, otp, expiry });

        // Send OTP to user's email
        const mailOptions = {
            from: 'sharathnellaya@gmail.com',
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        res.status(500).json({ message: 'Error generating OTP', error });
    }
});

app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Retrieve OTP record from the database based on email
        const otpRecord = await OTPCollection.findOne({ email: email });
        
        if (!otpRecord) {
            return res.status(400).json({ message: 'OTP not found for this email' });
        }

        // Log the stored OTP and entered OTP
        console.log('Stored OTP:', otpRecord.otp);
        console.log('Entered OTP:', otp);

        // Trim both OTPs before comparing
        if (otpRecord.otp.trim() === otp.trim()) {
            // OTP is correct, proceed with verification
            res.status(200).json({ message: 'OTP verified, registration complete' });
        } else {
            // OTPs don't match
            res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Error verifying OTP' });
    }
});





// MongoDB Atlas Connection String
mongoose.connect('mongodb+srv://sharathnellaya:Sarath%402001@cluster0.dsttq.mongodb.net/hostelDB?retryWrites=true&w=majority')
  .then(() => console.log('Connected to MongoDB Atlas successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Example route
app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

// Route for admin dashboard
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html')); // Adjust the path as needed
});

// Registration route
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    console.log('Registration attempt with data:', { name, email, password });

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashedPassword);

        // Create a new user and save to the database
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        console.log('User registered successfully:', newUser);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log('Login attempt with data:', { email, password }); // Added log for login attempts

    try {
        // Check if the user is the admin
        if (email === 'sharathnellaya@gmail.com' && password === 'Sarath@2001') {
            // Login successful for admin
            return res.status(200).json({ message: 'Login successful', user: 'Admin', isAdmin: true });
        }

        // For regular users, check against the database
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found:', email); // Log if user is not found
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid credentials for user:', email); // Log for invalid credentials
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // If login is successful for a regular user
        res.status(200).json({ message: 'Login successful', user: user.name, isAdmin: false });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Handle booking form submission
app.post('/book', async (req, res) => {
    const { fullName, phoneNumber, emailAddress, address, guardianName, guardianPhoneNumber } = req.body;

    try {
        const newBooking = new Booking({
            fullName,
            phoneNumber,
            emailAddress,
            address,
            guardianName,
            guardianPhoneNumber
        });

        await newBooking.save();

        res.status(201).json({ message: 'Booking successful', booking: newBooking });
    } catch (error) {
        console.error('Error saving booking:', error);
        res.status(500).json({ message: 'Server error during booking' });
    }
});

// Define your Hostel model (adjust according to your schema)
const Hostel = mongoose.model('Hostel', new mongoose.Schema({
    name: String,
    location: String,
    rent: Number,
    distance: String
}));

// API endpoints
// Get all hostels
app.get('/api/hostels', async (req, res) => {
    try {
        const hostels = await Hostel.find();
        res.json(hostels);
    } catch (error) {
        res.status(500).send('Error retrieving hostels');
    }
});

// Add a new hostel
app.post('/api/hostels', async (req, res) => {
    try {
        const newHostel = new Hostel(req.body);
        await newHostel.save();
        res.status(201).json(newHostel);
    } catch (error) {
        res.status(400).send('Error adding hostel');
    }
});

// Update an existing hostel
app.put('/api/hostels/:id', async (req, res) => {
    try {
        const updatedHostel = await Hostel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedHostel);
    } catch (error) {
        res.status(400).send('Error updating hostel');
    }
});

// Delete a hostel
app.delete('/api/hostels/:id', async (req, res) => {
    try {
        await Hostel.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).send('Error deleting hostel');
    }
});

// API endpoint to get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password from the response
        res.json(users);
    } catch (error) {
        res.status(500).send('Error retrieving users');
    }
});

// Delete a user by ID
app.delete('/api/users/:id', async (req, res) => {
    try {
        const userId = req.params.id; // Get the user ID from the request
        const user = await User.findByIdAndDelete(userId);
        
        // Check if the user was found and deleted
        if (!user) {
            console.log(`User not found with ID: ${userId}`); // Log if user is not found
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(`User deleted successfully: ${userId}`); // Log successful deletion
        res.status(204).send(); // Send a success response with no content
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error during user deletion' });
    }
});

// API endpoint to get all bookings
app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (error) {
        console.error('Error retrieving bookings:', error);
        res.status(500).send('Error retrieving bookings');
    }
});


// Delete a booking by ID
app.delete('/api/bookings/:id', async (req, res) => {
    try {
        const bookingId = req.params.id;

        // Validate the booking ID format (optional but recommended)
        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({ message: 'Invalid booking ID' });
        }

        const booking = await Booking.findByIdAndDelete(bookingId);
        
        // Check if the booking was found and deleted
        if (!booking) {
            console.log(`Booking not found with ID: ${bookingId}`); // Log if booking is not found
            return res.status(404).json({ message: 'Booking not found' });
        }

        console.log(`Booking deleted successfully: ${bookingId}`); // Log successful deletion
        res.status(200).json({ message: 'Booking deleted successfully' }); // Send success response
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Server error during booking deletion' });
    }
});

// Update a user by ID
app.put('/api/users/:id', async (req, res) => {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    try {
        // Update user details (hash password if it's being updated)
        const updateData = { name, email };
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(`User updated successfully: ${userId}`);
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error during user update' });
    }
});

// // GET user by ID
// router.get('/users/:id', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         if (!user) {
//             return res.status(404).send('User not found');
//         }
//         res.json(user);
//     } catch (error) {
//         res.status(500).send('Server error');
//     }
// });






// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
