import { useNotificationFired } from './useNotificationFired';

const { isFired: isNotificationFired, markFired: markNotificationFired, clearFired: clearNotificationFired } = useNotificationFired();

function isFired(todoId) {
  return isNotificationFired('TODO', todoId, String(todoId));
}

function markFired(todoId) {
  return markNotificationFired('TODO', todoId, String(todoId));
}

function clearFired(todoId) {
  return clearNotificationFired('TODO', todoId, String(todoId));
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
