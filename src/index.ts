import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import todoRoutes from './routes/todos';
import authRoutes from './routes/authRoutes';
import { initSentry } from './utils/sentry';
import { errorHandler } from './middleware/errorMiddleware';
import { logger } from './utils/logger';

// initSentry(); // Initialize Sentry

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use('/api/todos', todoRoutes);
app.use('/api/auth', authRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

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
