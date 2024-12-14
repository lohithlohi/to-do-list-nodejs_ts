import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const USERS_FILE_PATH = path.join(__dirname, '../data/users.json');

export interface User {
    id: number;
    username: string;
    password: string; // This will be the hashed password
}

export class UserModel {
    private static getUsers(): User[] {
        if (!fs.existsSync(USERS_FILE_PATH)) {
            fs.writeFileSync(USERS_FILE_PATH, JSON.stringify([]));
        }
        const users = fs.readFileSync(USERS_FILE_PATH, 'utf-8');
        return JSON.parse(users);
    }

    private static saveUsers(users: User[]): void {
        fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2));
    }

    public static async createUser(username: string, password: string): Promise<User> {
        const users = this.getUsers();
        const existingUser = users.find((user) => user.username === username);
        if (existingUser) {
            throw new Error('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser: User = {
            id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
            username,
            password: hashedPassword,
        };

        users.push(newUser);
        this.saveUsers(users);
        return newUser;
    }

    public static findUserByUsername(username: string): User | undefined {
        const users = this.getUsers();
        return users.find((user) => user.username === username);
    }

    public static findUserById(id: number): User | undefined {
        const users = this.getUsers();
        return users.find((user) => user.id === id);
    }
}
