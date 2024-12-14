import express, { Request, Response, Router } from "express";
import { readTodos, writeTodos } from "../utils/fileStorage";
import Todo from "../models/todo";
import { todoSchema } from "../utils/validation";
import { authenticate } from "../middleware/authMiddlewareFilesv";

const router = express.Router();
// let todos: Todo[] = [];

// let todos = [
//     { id: 1, task: 'Learn TypeScript', completed: false },
//     { id: 2, task: 'Build a project', completed: false },
// ];

// GET all todos
router.get("/", authenticate, async (req: Request, res: Response) => {
  const todos = await readTodos();
  res.status(200).json(todos);
});

// POST a new todo
router.post("/", authenticate, async (req, res) => {
  try {
    const parseResult = todoSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({ errors: parseResult.error.errors });
      return;
    }
    const todos = await readTodos();

    const newTodo = {
      id: todos.length ? todos[todos.length - 1].id + 1 : 1,
      ...parseResult.data,
    };
    // const newTodo = {
    //   id: todos.length ? todos[todos.length - 1].id + 1 : 1,
    //   task: parseResult.data.task, // Ensures task is assigned explicitly / task is guaranteed to exist
    //   completed: parseResult.data.completed,
    // };

    todos.push(newTodo);
    await writeTodos(todos);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "An Unknown Error Occured",
    });
  }
});

// PUT to update a todo
router.put(
  "/:id",
  authenticate,
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const todos = await readTodos();
      const tid = parseInt(req.params.id, 10);
      const todo = todos.find((t) => t.id === tid);

      if (!todo) {
        res.status(404).json({ message: "Todo not found" });
        return;
      }

      // '?' -> optional  ,  '!' -> infering it's defined type
      todo!.task = req.body.task ?? todo!.task;
      todo!.completed = req.body.completed ?? todo!.completed;
      await writeTodos(todos);
      res.json(todo);
    } catch (error) {
      res.status(400).json({
        message:
          error instanceof Error ? error.message : "An Unknown Error Occured",
      });
    }
  }
);

// DELETE a todo
router.delete(
  "/:id",
  authenticate,
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const todos = await readTodos();
      const id = parseInt(req.params.id, 10);
      const updatedTodos = todos.filter((t) => t.id !== id);

      if (updatedTodos.length === todos.length) {
        res.status(404).json({ error: "Todo not found" });
        return;
      }

      await writeTodos(updatedTodos);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({
        message:
          error instanceof Error ? error.message : "An Unknown Error Occured",
      });
    }
  }
);

export default router;
