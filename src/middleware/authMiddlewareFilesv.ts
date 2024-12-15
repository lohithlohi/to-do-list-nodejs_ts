import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModelFilesv';

const JWT_SECRET = 'My_secret_key'; // Replace with a secure secret in production

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
        const user = UserModel.findUserById(decoded.id);

        if (!user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        // req.user = user; // Attach user to the request object
        req.body.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
