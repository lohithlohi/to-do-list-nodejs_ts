// src/app.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import todoRoutes from './routes/todoRoutes';
import authRoutes from './routes/authRoutes';
import { initSentry } from './utils/sentry';
import { errorHandler } from './middleware/errorMiddleware';
import { logger } from './utils/logger';

// initSentry(); // Initialize Sentry

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(errorHandler);

// Routes
app.use('/todos', todoRoutes);
app.use('/auth', authRoutes);

// MongoDB connection
const MONGO_URI = 'mongodb://localhost:27017/todo-app'; // 'your-mongodb-connection-string';
mongoose
    .connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));


    // Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
    console.error('[Unhandled Rejection]', reason);
    logger.error({ message: 'Unhandled Rejection', reason });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('[Uncaught Exception]', error);
    logger.error({ message: 'Uncaught Exception', stack: error.stack });
    process.exit(1); // Optional: Restart the app on uncaught exceptions
});

export default app;
