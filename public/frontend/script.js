const API_URL = 'http://localhost:3000/api/todos';

async function fetchTasks() {
  const response = await fetch(API_URL);   // GET call
  const todos = await response.json();
  const todoList = document.getElementById('todos');
  todoList.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.textContent = `${todo.task} - ${todo.completed ? 'Completed' : 'Pending'}`;
    todoList.appendChild(li);
  });
}

async function addTask() {
  const input = document.getElementById('taskInput');
  const newTodo = { task: input.value };
  await fetch(API_URL, {      // POST call
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTodo),
  });
  input.value = '';
  fetchTasks();
}

fetchTasks();
