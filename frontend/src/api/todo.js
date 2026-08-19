import http from './http';
import { toDatetimeLocal } from '../utils/date';

export async function getTodos() {
  const { data } = await http.get('/todos');
  return data;
}

export async function getTodosInRange(start, end) {
  const { data } = await http.get('/todos/range', {
    params: { start: toDatetimeLocal(start), end: toDatetimeLocal(end) },
  });
  return data;
}

export async function createTodo(todo) {
  const { data } = await http.post('/todos', todo);
  return data;
}

export async function updateTodo(id, todo) {
  const { data } = await http.put(`/todos/${id}`, todo);
  return data;
}

export async function completeTodo(id, completed) {
  const { data } = await http.patch(`/todos/${id}/complete`, { completed });
  return data;
}

export async function deleteTodo(id) {
  await http.delete(`/todos/${id}`);
}
