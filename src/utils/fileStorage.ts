import { promises as fs } from 'fs';
import path from 'path';
import Todo from '../models/todo';

const filePath = path.join(__dirname, '../data/todos.json');

export async function readTodos(): Promise<Todo[]> {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data) as Todo[];
    } catch (error) {
        console.error('Error reading file:', error);
        return [];
    }
}

export async function writeTodos(todos: Todo[]): Promise<void> {
    try {
        await fs.writeFile(filePath, JSON.stringify(todos, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing file:', error);
    }
}

// export interface Todo {
//     id: number;
//     task: string;
//     completed: boolean;
// }
