const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    mood: String,
    songs: [String],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Playlist', playlistSchema);