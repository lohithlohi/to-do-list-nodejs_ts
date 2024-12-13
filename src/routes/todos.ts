import express, { Request, Response, Router } from 'express';
import Todo from '../models/todo';

const router = express.Router();
let todos: Todo[] = [];

// let todos = [
//     { id: 1, task: 'Learn TypeScript', completed: false },
//     { id: 2, task: 'Build a project', completed: false },
// ];


router.get('/', (req, res) => {
    res.status(200).json(todos);
});


router.post('/', (req, res) => {
    const newTodo: Todo = { id: todos.length + 1, task: req.body.task, completed: false };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});


router.put('/:id', (req, res) => {
    const tid = parseInt(req.params.id);
    const todo = todos.find(t => t.id === tid);
    if(todo == undefined){
        res.status(404).json({ error: 'Todo not found' });
    }
    // '?' -> optional  ,  '!' -> infering it's defined type
    todo!.completed = req.body.completed ?? todo!.completed;
    todo!.task = req.body.task ?? todo!.task;

    res.json(todo);
});


router.delete('/:id', (req, res) => {
    const tid = parseInt(req.params.id);
    todos = todos.filter(t => t.id !== tid);
    res.status(204).send();
});

export default router;
