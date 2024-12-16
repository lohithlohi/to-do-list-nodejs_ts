import express, { NextFunction, Request, Response, Router } from "express";
import { readTodos, writeTodos } from "../utils/fileStorage";
import Todo from "../models/todo";
import { todoSchema } from "../validators/validation";
import { authenticate } from "../middleware/authMiddlewareFilesv";
import { AppError } from "../utils/errorHandler";

const router = express.Router();
// let todos: Todo[] = [];

// let todos = [
//     { id: 1, task: 'Learn TypeScript', completed: false },
//     { id: 2, task: 'Build a project', completed: false },
// ];

// GET all todos
router.get("/", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const todos = await readTodos();
    if (!todos) {
      throw new AppError("Todo not found", 404);
    }
    res.status(200).json(todos);
  } catch (err) {
    next(err); // Pass the error to the centralized error handler
  }
});

// Get todo by Id
router.get(
  "/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const todos = await readTodos();
      const todo = todos.find((t) => t.id === parseInt(id));

      if (!todo) {
        throw new AppError("Todo not found", 404);
      }

      res.status(200).json(todo);
    } catch (err) {
      next(err); // Pass the error to the centralized error handler
    }
  }
);

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
  async (req: Request<{ id: string }>, res: Response, next : NextFunction) => {
    try {
      const todos = await readTodos();
      const tid = parseInt(req.params.id, 10);
      const todo = todos.find((t) => t.id === tid);

      if (!todo) {
        throw new AppError("Todo not found", 404);
      }

      // '?' -> optional  ,  '!' -> infering it's defined type
      todo.task = req.body.task ?? todo.task;
      todo.completed = req.body.completed ?? todo.completed;
      await writeTodos(todos);
      res.json(todo);
    } catch (err) {
      next(err); // Pass the error to the centralized error handler
    }
  }
);

// DELETE a todo
router.delete(
  "/:id",
  authenticate,
  async (req: Request<{ id: string }>, res: Response, next : NextFunction) => {
    try {
      const todos = await readTodos();
      const id = parseInt(req.params.id, 10);
      const updatedTodos = todos.filter((t) => t.id !== id);

      if (updatedTodos.length === todos.length) {
        throw new AppError("Todo not found", 404);
      }

      await writeTodos(updatedTodos);
      res.status(204).send();
    } catch (err) {
      next(err); // Pass the error to the centralized error handler
    }
  }
);

router.get("/error", () => {
  throw new AppError("This is a simulated error", 400);
});

router.patch('/:id/status', async (req: Request, res: Response, next : NextFunction) => {
  try {
    const { id } = req.params; // Extract the task ID from the route parameter
    const { completed } = req.body; // Extract the new status from the request body

    // Validate the request data
    if (typeof completed !== 'boolean') {
      throw new AppError("Invalid completed status. Must be true or false.", 400);
    }

    // Read the file storage
    const todos = await readTodos();
    const todoIndex = todos.findIndex((todo: Todo) => todo.id === parseInt(id));

    if (todoIndex === -1) {
      throw new AppError("Todo not found", 404);
    }

    // Update the task's completed status
    todos[todoIndex].completed = completed;

    // Write the updated data back to the file
    await writeTodos(todos);

    // Send the updated task as a response
    res.json(todos[todoIndex]);
  } catch (err) {
    next(err); // Pass the error to the centralized error handler
  }
});


export default router;
