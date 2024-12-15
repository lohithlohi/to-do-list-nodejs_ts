// src/routes/todoRoutes.ts
import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    ForceError,
} from '../controllers/todoController';

const router = express.Router();

router.get('/', authenticate, getTodos);
router.post('/', authenticate, createTodo);
router.put('/:id', authenticate, updateTodo);
router.delete('/:id', authenticate, deleteTodo);
router.get('/error', ForceError);

export default router;
