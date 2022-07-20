import React from 'react';
import { proxy, useSnapshot } from 'valtio';

const state = proxy({
  filter: 'all',
  todos: [],
});

let todoId = 0;
const addTodo = (title, completed) => {
  if (!title) {
    return;
  }
  const id = ++todoId;
  state.todos.push({ id, title, completed });
};

const removeTodo = (id) => {
  state.todos = state.todos.filter((todo) => todo.id !== id);
};

const toggleTodo = (id) => {
  const todo = state.todos.find((todo) => todo.id === id);
  todo.completed = !todo.completed;
};

const useFilteredTodos = () => {
  const { filter, todos } = useSnapshot(state);
  if (filter === 'all') {
    return todos;
  }
  if (filter === 'completed') {
    return todos.filter((todo) => todo.completed);
  }
  return todos.filter((todo) => !todo.completed);
};

const TodoItem = ({ todo }) => (
  <div>
    <input
      type='checkbox'
      checked={todo.completed}
      onChange={() => toggleTodo(todo.id)}
    />
    <span style={{ textDecoration: todo.completed ? 'line-through' : '' }}>
      {todo.title}
    </span>
    <button onClick={() => removeTodo(todo.id)}>x</button>
  </div>
);

const Filter = () => {
  const { filter } = useSnapshot(state);
  const handleChange = (e) => {
    state.filter = e.target.value;
  };
  return (
    <div>
      <label>
        <input
          type='radio'
          value='all'
          checked={filter === 'all'}
          onChange={handleChange}
        />
        All
      </label>
      <label>
        <input
          type='radio'
          value='completed'
          checked={filter === 'completed'}
          onChange={handleChange}
        />
        Completed
      </label>
      <label>
        <input
          type='radio'
          value='incompleted'
          checked={filter === 'incompleted'}
          onChange={handleChange}
        />
        Incompleted
      </label>
    </div>
  );
};

const TodoList = () => {
  const filtered = useFilteredTodos();
  const add = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    e.target.title.value = '';
    addTodo(title, false);
  };
  return (
    <div>
      <Filter />
      <form onSubmit={add}>
        <input name='title' placeholder='Enter title...' />
      </form>
      {filtered.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};

export const MyTodos = () => (
  <div>
    <h1>Todos</h1>
    <TodoList />
  </div>
);
