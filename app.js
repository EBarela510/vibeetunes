require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Import Playlist model
const Playlist = require('./models/Playlist');

// Routes

// Get playlists by mood
app.get('/api/playlists/:mood', async (req, res) => {
    try {
        const playlists = await Playlist.find({ mood: req.params.mood });
        res.json(playlists);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create playlist
app.post('/api/playlists', async (req, res) => {
    const playlist = new Playlist({
        mood: req.body.mood,
        songs: req.body.songs
    });
    try {
        const newPlaylist = await playlist.save();
        res.status(201).json(newPlaylist);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update playlist by mood
app.put('/api/playlists/:mood', async (req, res) => {
    try {
        const updatedPlaylist = await Playlist.findOneAndUpdate(
            { mood: req.params.mood },
            { songs: req.body.songs },
            { new: true }
        );
        if (!updatedPlaylist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        res.json(updatedPlaylist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete playlist by mood
app.delete('/api/playlists/:mood', async (req, res) => {
    try {
        const deletedPlaylist = await Playlist.findOneAndDelete({ mood: req.params.mood });
        if (!deletedPlaylist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        res.json({ message: 'Playlist deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Serve frontend (optional, if you want / to load index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});