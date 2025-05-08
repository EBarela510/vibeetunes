async function getPlaylists() {
    const mood = document.getElementById('moodSelect').value;
    const res = await fetch(`/api/playlists/${mood}`);
    const playlists = await res.json();

    const playlistEl = document.getElementById('playlist');
    playlistEl.innerHTML = '';

    if (playlists.length === 0) {
        playlistEl.innerHTML = '<li>No playlists found for this mood.</li>';
        return;
    }

    playlists.forEach(p => {
        const li = document.createElement('li');
        li.textContent = `${p.mood.toUpperCase()}: ${p.songs.join(', ')}`;
        playlistEl.appendChild(li);
    });
}

async function createPlaylist() {
    const mood = document.getElementById('newMood').value;
    const songs = document.getElementById('newSongs').value.split(',');

    await fetch('/api/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, songs: songs.map(s => s.trim()) })
    });

    alert('Playlist created!');
    getPlaylists();
}

async function updatePlaylist() {
    const mood = document.getElementById('updateMood').value;
    const songs = document.getElementById('updateSongs').value.split(',');

    await fetch(`/api/playlists/${mood}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songs: songs.map(s => s.trim()) })
    });

    alert('Playlist updated!');
    getPlaylists();
}

async function deletePlaylist() {
    const mood = document.getElementById('deleteMood').value;

    await fetch(`/api/playlists/${mood}`, {
        method: 'DELETE'
    });

    alert('Playlist deleted!');
    getPlaylists();
}

require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));