const API_BASE = '';

function showMessage(msg, type = 'success') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = msg;
    messageEl.className = type;
    setTimeout(() => messageEl.textContent = '', 3000);
}

async function getPlaylists() {
    const mood = document.getElementById('moodSelect').value;
    if (!mood) return showMessage('Please select a mood.', 'error');

    const res = await fetch(`${API_BASE}/api/playlists/${mood}`);
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
    const songs = document.getElementById('newSongs').value.split(',').map(s => s.trim());
    if (!mood || songs.length === 0) return showMessage('Please enter mood and songs.', 'error');

    await fetch(`${API_BASE}/api/playlists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, songs })
    });

    showMessage('Playlist created!');
    document.getElementById('newMood').value = '';
    document.getElementById('newSongs').value = '';
    getPlaylists();
}

async function updatePlaylist() {
    const mood = document.getElementById('updateMood').value;
    const songs = document.getElementById('updateSongs').value.split(',').map(s => s.trim());
    if (!mood || songs.length === 0) return showMessage('Please enter mood and new songs.', 'error');

    await fetch(`${API_BASE}/api/playlists/${mood}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songs })
    });

    showMessage('Playlist updated!');
    document.getElementById('updateMood').value = '';
    document.getElementById('updateSongs').value = '';
    getPlaylists();
}

async function deletePlaylist() {
    const mood = document.getElementById('deleteMood').value;
    if (!mood) return showMessage('Please enter mood to delete.', 'error');

    await fetch(`${API_BASE}/api/playlists/${mood}`, {
        method: 'DELETE'
    });

    showMessage('Playlist deleted!');
    document.getElementById('deleteMood').value = '';
    getPlaylists();
}