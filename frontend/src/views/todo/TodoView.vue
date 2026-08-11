<script setup>
import { ref, onMounted } from 'vue';
import { getTodos, createTodo, updateTodo, completeTodo, deleteTodo } from '../../api/todo';
import { useTodoNotifications } from '../../composables/useTodoNotifications';
import TodoModal from './TodoModal.vue';
import '../../assets/todo.css';

const { clearFired } = useTodoNotifications();

const todos = ref([]);
const modalOpen = ref(false);
const editingTodo = ref(null);

async function loadTodos() {
  todos.value = await getTodos();
}

onMounted(loadTodos);

function openCreateModal() {
  editingTodo.value = null;
  modalOpen.value = true;
}

function openEditModal(todo) {
  editingTodo.value = todo;
  modalOpen.value = true;
}

function closeModal() {
  modalOpen.value = false;
  editingTodo.value = null;
}

async function handleSave(data) {
  if (editingTodo.value) {
    await updateTodo(editingTodo.value.id, data);
  } else {
    await createTodo(data);
  }
  closeModal();
  await loadTodos();
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
  <div class="todos-page">
    <div class="todos-header">
      <h1>할 일</h1>
      <button type="button" @click="openCreateModal">+ 할 일 추가</button>
    </div>

    <p v-if="todos.length === 0" class="no-todos">등록된 할 일이 없습니다.</p>

    <ul v-else class="todo-list">
      <li v-for="todo in todos" :key="todo.id" :class="['todo-item', { completed: todo.completed }]">
        <div class="todo-info" @click="openEditModal(todo)">
          <span class="todo-title">{{ todo.title }}</span>
          <span v-if="todo.dueDate" class="todo-due" :class="{ overdue: isOverdue(todo) }">
            {{ formatDue(todo.dueDate) }}
          </span>
          <span v-if="todo.description" class="todo-desc">{{ todo.description }}</span>
        </div>
        <div class="todo-actions">
          <label class="switch">
            <input type="checkbox" :checked="todo.completed" @change="handleToggleComplete(todo)" />
            <span class="switch-track"></span>
          </label>
          <button type="button" class="delete-btn" @click="handleDelete(todo.id)">삭제</button>
        </div>
      </li>
    </ul>

    <TodoModal v-if="modalOpen" :todo="editingTodo" @save="handleSave" @close="closeModal" />
  </div>
</template>
