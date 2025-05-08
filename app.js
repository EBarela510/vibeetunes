require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Mongoose model
const playlistSchema = new mongoose.Schema({
    mood: { type: String, required: true },
    song: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Playlist = mongoose.model('Playlist', playlistSchema);

// Routes

// Add mood + song
app.post('/api/playlists', async (req, res) => {
    const { mood, song } = req.body;
    if (!mood || !song) return res.status(400).json({ error: 'Mood and song are required.' });
    try {
        const newEntry = new Playlist({ mood, song });
        await newEntry.save();
        res.json(newEntry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all songs by mood
app.get('/api/playlists/:mood', async (req, res) => {
    try {
        const entries = await Playlist.find({ mood: req.params.mood });
        res.json(entries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));