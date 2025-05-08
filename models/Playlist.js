const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    mood: { type: String, required: true },
    songs: [String],
    description: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Playlist', playlistSchema);