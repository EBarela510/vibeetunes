require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Import Playlist model
const Playlist = require('./models/Playlist');

// ROUTES WITH LOGS

// Get playlists by mood
app.get('/api/playlists/:mood', async (req, res) => {
    console.log('👉 GET /api/playlists/' + req.params.mood);
    try {
        const playlists = await Playlist.find({ mood: req.params.mood });
        console.log('✅ Found playlists:', playlists);
        res.json(playlists);
    } catch (err) {
        console.error('❌ Error fetching playlists:', err);
        res.status(500).json({ message: err.message });
    }
});

// Create a new playlist
app.post('/api/playlists', async (req, res) => {
    console.log('👉 POST /api/playlists with body:', req.body);
    const playlist = new Playlist({
        mood: req.body.mood,
        songs: req.body.songs
    });
    try {
        const saved = await playlist.save();
        console.log('✅ Saved to MongoDB:', saved);
        res.status(201).json(saved);
    } catch (err) {
        console.error('❌ Error saving to MongoDB:', err);
        res.status(400).json({ message: err.message });
    }
});

// Update playlist by mood
app.put('/api/playlists/:mood', async (req, res) => {
    console.log('👉 PUT /api/playlists/' + req.params.mood, 'with body:', req.body);
    try {
        const updated = await Playlist.findOneAndUpdate(
            { mood: req.params.mood },
            { songs: req.body.songs },
            { new: true }
        );
        if (!updated) {
            console.log('⚠️ Playlist not found for update');
            return res.status(404).json({ message: 'Playlist not found' });
        }
        console.log('✅ Updated playlist:', updated);
        res.json(updated);
    } catch (err) {
        console.error('❌ Error updating playlist:', err);
        res.status(500).json({ message: err.message });
    }
});

// Delete playlist by mood
app.delete('/api/playlists/:mood', async (req, res) => {
    console.log('👉 DELETE /api/playlists/' + req.params.mood);
    try {
        const deleted = await Playlist.findOneAndDelete({ mood: req.params.mood });
        if (!deleted) {
            console.log('⚠️ Playlist not found for deletion');
            return res.status(404).json({ message: 'Playlist not found' });
        }
        console.log('✅ Deleted playlist:', deleted);
        res.json({ message: 'Playlist deleted' });
    } catch (err) {
        console.error('❌ Error deleting playlist:', err);
        res.status(500).json({ message: err.message });
    }
});

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

const API_BASE = '';

async function getPlaylists() { /* ... */ }
async function createPlaylist() { /* ... */ }
async function updatePlaylist() { /* ... */ }
async function deletePlaylist() { /* ... */ }
function showMessage(msg, type = 'success') { /* ... */ }