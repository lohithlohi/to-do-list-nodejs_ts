import { z } from 'zod';

export const todoSchema = z.object({
    id: z.number().optional(), // Optional because it will be added by the backend
    task: z.string().min(1, 'Task cannot be empty'), // Must be a non-empty string
    completed: z.boolean().default(false),
});

export type Todo = z.infer<typeof todoSchema>;