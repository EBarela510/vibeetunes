const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');

// Get playlists by mood
router.get('/:mood', async (req, res) => {
    try {
        const playlists = await Playlist.find({ mood: req.params.mood });
        res.json(playlists);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new playlist
router.post('/', async (req, res) => {
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

module.exports = router;