import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import competitionImportRoutes from './routes/competitionImportRoutes';
import playerRoutes from './routes/playerRoutes';
import teamRoutes from './routes/teamRoutes';
import competitionRoutes from './routes/competitionRoutes';

// Load environment variables from .env file
require('dotenv').config();

// Connect to MongoDB
const mongoString = process.env.DATABASE_URL || '';
mongoose.connect(mongoString);
const db = mongoose.connection;

db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});
db.once('connected', () => {
    console.log('MongoDB connected');
});

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/competitionImport', competitionImportRoutes);
app.use('/api/competitions', competitionRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/teams', teamRoutes);

// Catch-all middleware for handling requests to non-existent routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});