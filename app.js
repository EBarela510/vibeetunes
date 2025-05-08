require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
const playlistRoutes = require('./routes/playlistRoutes');
app.use('/api/playlists', playlistRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

async function getPlaylists() {
    const mood = document.getElementById('moodSelect').value;
    const res = await fetch(`/api/playlists/${mood}`);
    const playlists = await res.json();

    const playlistEl = document.getElementById('playlist');
    playlistEl.innerHTML = '';

    playlists.forEach(p => {
        const li = document.createElement('li');
        li.textContent = `${p.mood.toUpperCase()}: ${p.songs.join(', ')}`;
        playlistEl.appendChild(li);
    });
}