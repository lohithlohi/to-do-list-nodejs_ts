import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHandler';
import { logger } from '../utils/logger';
import * as Sentry from '@sentry/node';

export const errorHandler = (
    err: AppError | Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err.message || 'Internal Server Error';

    // // Log the error for debugging
    // console.error(`[Error]: ${message}, Stack: ${err.stack}`);

    // Sentry.captureException(err); // Send the error to Sentry

    // Log the error to the console and file
    console.error(`[Error]: ${message}`);
    logger.error({ message, stack: err.stack, statusCode, url: req.url });

    res.status(statusCode).json({
        status: 'error',
        message,
    });
};
