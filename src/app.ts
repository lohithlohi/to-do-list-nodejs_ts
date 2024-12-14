// src/app.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import todoRoutes from './routes/todoRoutes';
import authRoutes from './routes/authRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/todos', todoRoutes);
app.use('/auth', authRoutes);

// MongoDB connection
const MONGO_URI = 'mongodb://localhost:27017/todo-app'; // 'your-mongodb-connection-string';
mongoose
    .connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

export default app;
