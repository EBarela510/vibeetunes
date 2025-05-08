const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    mood: { type: String, required: true },
    song: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Playlist', playlistSchema);