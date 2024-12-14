// src/controllers/todoController.ts
import { Request, Response } from 'express';
import { Todo } from '../models/todoModel';
import { validateTodo } from '../validators/todoValidator';

// Get all todos
export const getTodos = async (req: Request, res: Response): Promise<void> => {
    try {
        const todos = await Todo.find();
        res.status(200).json(todos);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
};


// Create a new todo
export const createTodo = async (req: Request, res: Response): Promise<void> => {
    try {
        const validatedData = validateTodo(req.body); // Validate input
        const todo = new Todo(validatedData);
        await todo.save();
        res.status(201).json(todo);
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid data' });
    }
};


// Update a todo
export const updateTodo = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const validatedData = validateTodo(req.body); // Validate input
        const todo = await Todo.findByIdAndUpdate(id, validatedData, { new: true });
        if (!todo) {
            res.status(404).json({ message: 'Todo not found' });
            return;
        }
        res.status(200).json(todo);
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid data' });
    }
};


// Delete a todo
export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const todo = await Todo.findByIdAndDelete(id);

        if (!todo) {
            res.status(404).json({ message: 'Todo not found' });
            return;
        }

        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
};
