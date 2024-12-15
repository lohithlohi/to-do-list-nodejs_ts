import { createLogger, format, transports } from 'winston';
import path from 'path';

const logFilePath = path.join(__dirname, '../logs/app.log');

export const logger = createLogger({
    level: 'error',
    format: format.combine(
        format.timestamp(),
        format.json(),
        format.prettyPrint()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: logFilePath })
    ],
});
