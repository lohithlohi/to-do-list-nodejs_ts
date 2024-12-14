// src/validators/todoValidator.ts
import { z } from 'zod';

export const todoSchema = z.object({
    task: z.string().min(1, { message: 'Task cannot be empty' }),
    completed: z.boolean().optional(),
});

export const validateTodo = (data: unknown) => {
    return todoSchema.parse(data); // Will throw if validation fails
};
