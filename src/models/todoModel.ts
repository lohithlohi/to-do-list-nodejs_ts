// src/models/todoModel.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ITodo extends Document {
    task: string;
    completed: boolean;
}

const todoSchema: Schema = new Schema({
    task: { type: String, required: true },
    completed: { type: Boolean, default: false },
});

export const Todo = mongoose.model<ITodo>('Todo', todoSchema);
