<script setup>
import { reactive, ref, onMounted } from 'vue';
import { getTodos, createTodo, completeTodo, deleteTodo } from '../../api/todo';
import { useTodoNotifications } from '../../composables/useTodoNotifications';
import { toDatetimeLocal } from '../../utils/date';
import '../../assets/todo.css';

const { clearFired } = useTodoNotifications();

const todos = ref([]);
const form = reactive({ title: '', description: '', dueDate: '' });
const loading = ref(false);

async function loadTodos() {
  todos.value = await getTodos();
}

onMounted(loadTodos);

async function handleSubmit() {
  if (!form.title.trim()) return;
  loading.value = true;
  try {
    await createTodo({
      title: form.title,
      description: form.description || null,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
    });
    form.title = '';
    form.description = '';
    form.dueDate = '';
    await loadTodos();
  } finally {
    loading.value = false;
  }
}

async function handleToggleComplete(todo) {
  const completed = !todo.completed;
  await completeTodo(todo.id, completed);
  if (!completed) clearFired(todo.id);
  await loadTodos();
}

async function handleDelete(id) {
  await deleteTodo(id);
  clearFired(id);
  await loadTodos();
}

function isOverdue(todo) {
  return !todo.completed && todo.dueDate && new Date(todo.dueDate) < new Date();
}

function formatDue(dueDate) {
  return new Date(dueDate).toLocaleString('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
</script>

<template>
  <div class="todo-app">
    <div class="todo-header">
      <h2>할 일</h2>
    </div>

    <form class="todo-form" @submit.prevent="handleSubmit">
      <input v-model="form.title" type="text" placeholder="할 일을 입력하세요" required maxlength="100" />
      <input v-model="form.dueDate" type="datetime-local" />
      <textarea v-model="form.description" placeholder="설명 (선택)" maxlength="500"></textarea>
      <button type="submit" :disabled="loading">등록</button>
    </form>

    <p v-if="todos.length === 0" class="no-todos">등록된 할 일이 없습니다.</p>
    <ul v-else class="todo-items">
      <li v-for="todo in todos" :key="todo.id" class="todo-item" :class="{ completed: todo.completed }">
        <input
          type="checkbox"
          :checked="todo.completed"
          @change="handleToggleComplete(todo)"
        />
        <div class="todo-item-main">
          <span class="todo-title">{{ todo.title }}</span>
          <span v-if="todo.dueDate" class="todo-due" :class="{ overdue: isOverdue(todo) }">
            {{ formatDue(todo.dueDate) }}
          </span>
          <p v-if="todo.description" class="todo-desc">{{ todo.description }}</p>
        </div>
        <button class="delete-btn" type="button" @click="handleDelete(todo.id)">삭제</button>
      </li>
    </ul>
  </div>
</template>
