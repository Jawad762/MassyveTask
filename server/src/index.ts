import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoute';
import userRoutes from './routes/userRoute';
import cookieParser from 'cookie-parser';
import { authMiddleware } from './middleware/authMiddleware';
import path from 'path';
import cors from 'cors'

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.static(path.join(__dirname, '../../client/out')));

const dbConnectionString = process.env.MONGODB_CONNECTION_STRING;
if (dbConnectionString) {
    mongoose.connect(dbConnectionString);
    const connection = mongoose.connection;

    connection.on('open', () => {
        console.log('Connected to db');
    });

    connection.on('error', (err) => {
        console.error('Connection error', err);
    });
}

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', authMiddleware, userRoutes);

app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../client/out/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
