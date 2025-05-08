require('dotenv').config();
const mongoose = require('mongoose');
const Playlist = require('./models/Playlist');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

const seedData = [
    { mood: 'happy', songs: ['Happy by Pharrell', 'Good Vibrations'] },
    { mood: 'sad', songs: ['Someone Like You', 'Fix You'] },
    { mood: 'calm', songs: ['Weightless', 'Clair de Lune'] },
    { mood: 'angry', songs: ['Break Stuff', 'Killing in the Name'] }
];

async function seedDB() {
    try {
        await Playlist.deleteMany({});
        console.log('🧹 Cleared old playlists');

        await Playlist.insertMany(seedData);
        console.log('🌱 Seed data inserted');

        mongoose.connection.close();
    } catch (err) {
        console.error('❌ Seeding error:', err);
        mongoose.connection.close();
    }
}

seedDB();