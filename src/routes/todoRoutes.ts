// src/routes/todoRoutes.ts
import express from 'express';
import {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
} from '../controller/todoController';

const router = express.Router();

router.get('/', getTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;
