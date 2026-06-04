
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = 3000;
const SUBMISSIONS_FILE = path.join(__dirname, 'submissions.json');
const BOOKINGS_FILE = path.join(__dirname, 'bookings.json');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ensure files exist
if (!fs.existsSync(SUBMISSIONS_FILE)) fs.writeJsonSync(SUBMISSIONS_FILE, []);
if (!fs.existsSync(BOOKINGS_FILE)) fs.writeJsonSync(BOOKINGS_FILE, []);

// Helper to get all bookings
async function getBookings() {
    return await fs.readJson(BOOKINGS_FILE);
}

// Define windows
const SLOTS = [
    { id: 'morning', label: 'Morning (9 AM - 12 PM)' },
    { id: 'afternoon', label: 'Afternoon (12 PM - 4 PM)' },
    { id: 'evening', label: 'Evening (4 PM - 7 PM)' }
];

app.get('/available-slots', async (req, res) => {
    const { date } = req.query; // YYYY-MM-DD
    if (!date) {
        return res.status(400).json({ error: 'Date is required' });
    }

    try {
        const bookings = await getBookings();
        const bookedOnDate = bookings.filter(b => b.date === date).map(b => b.time);
        
        const availableSlots = SLOTS.map(slot => ({
            ...slot,
            available: !bookedOnDate.includes(slot.id)
        }));

        res.json(availableSlots);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch slots' });
    }
});

app.post('/submit-form', async (req, res) => {
    try {
        const { formType, ...formData } = req.body;
        const submission = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            formType,
            data: formData
        };

        const submissions = await fs.readJson(SUBMISSIONS_FILE);
        submissions.push(submission);
        await fs.writeJson(SUBMISSIONS_FILE, submissions, { spaces: 2 });

        console.log(`New submission received for ${formType}:`, formData);
        res.status(200).json({ success: true, message: 'Submission received' });
    } catch (error) {
        console.error('Error handling submission:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/submit-booking', async (req, res) => {
    try {
        const bookingData = req.body;
        const booking = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...bookingData
        };

        const bookings = await fs.readJson(BOOKINGS_FILE);
        
        // Double check availability
        const isTaken = bookings.some(b => b.date === bookingData.date && b.time === bookingData.time);
        if (isTaken) {
            return res.status(400).json({ success: false, message: 'Slot already taken' });
        }

        bookings.push(booking);
        await fs.writeJson(BOOKINGS_FILE, bookings, { spaces: 2 });

        console.log('New appointment booked:', booking);
        res.status(200).json({ success: true, message: 'Booking confirmed' });
    } catch (error) {
        console.error('Error handling booking:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.get('/submissions', async (req, res) => {
    try {
        const submissions = await fs.readJson(SUBMISSIONS_FILE);
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.get('/bookings', async (req, res) => {
    try {
        const bookings = await fs.readJson(BOOKINGS_FILE);
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`NeighborTech Form & Booking Server listening on port ${PORT}`);
});
