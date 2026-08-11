import { ref, watch } from 'vue';
import { useAuth } from './useAuth';

const { username } = useAuth();

// 이미 알림을 보낸 todoId 목록 (중복 알림 방지)
const firedTodos = ref([]);

let firedKey = '';

function keyFor() {
  const user = username.value || 'guest';
  return `firedTodos:${user}`;
}

function load() {
  firedKey = keyFor();
  try {
    firedTodos.value = JSON.parse(localStorage.getItem(firedKey)) || [];
  } catch {
    firedTodos.value = [];
  }
}

function persist() {
  localStorage.setItem(firedKey, JSON.stringify(firedTodos.value));
}

load();
watch(username, load);
watch(firedTodos, persist, { deep: true });

function isFired(todoId) {
  return firedTodos.value.includes(todoId);
}

function markFired(todoId) {
  firedTodos.value.push(todoId);
  if (firedTodos.value.length > 200) {
    firedTodos.value = firedTodos.value.slice(-200);
  }
}

function clearFired(todoId) {
  firedTodos.value = firedTodos.value.filter((id) => id !== todoId);
}

// 완료되지 않았고 마감일이 지난 할 일 중 아직 알림을 보내지 않은 것을 계산한다.
function computeDueTodos(todos, now = new Date()) {
  const due = [];
  for (const todo of todos) {
    if (todo.completed || !todo.dueDate) continue;
    const dueDate = new Date(todo.dueDate);
    if (dueDate > now) continue;
    if (isFired(todo.id)) continue;
    due.push(todo);
  }
  return due;
}

export function useTodoNotifications() {
  return { computeDueTodos, markFired, clearFired };
}
