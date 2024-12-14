import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModelFilesv';

const JWT_SECRET = 'your_secret_key'; // Replace with a secure secret in production

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
        const newUser = await UserModel.createUser(username, password);
        res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, username: newUser.username } });
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error creating user' });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
        const user = UserModel.findUserByUsername(username);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Invalid password' });
            return;
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error logging in' });
    }
};
