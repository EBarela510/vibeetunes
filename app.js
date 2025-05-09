require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
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

// Add mood + song (normalize mood to lowercase)
app.post('/api/playlists', async (req, res) => {
    const mood = req.body.mood.trim().toLowerCase();
    const song = req.body.song.trim();
    if (!mood || !song) return res.status(400).json({ error: 'Mood and song are required.' });
    try {
        const newEntry = new Playlist({ mood, song });
        await newEntry.save();
        res.json(newEntry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all songs
app.get('/api/playlists', async (req, res) => {
    try {
        const entries = await Playlist.find();
        res.json(entries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get songs by mood (case-insensitive search)
app.get('/api/playlists/:mood', async (req, res) => {
    try {
        const entries = await Playlist.find({
            mood: { $regex: new RegExp(`^${req.params.mood}$`, 'i') }
        });
        res.json(entries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete song by ID
app.delete('/api/playlists/:id', async (req, res) => {
    try {
        await Playlist.findByIdAndDelete(req.params.id);
        res.json({ message: 'Song deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));