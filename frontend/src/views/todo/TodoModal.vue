<script setup>
import { ref } from 'vue';
import { toDatetimeLocal } from '../../utils/date';

const props = defineProps({
  todo: { type: Object, default: null },
});

const emit = defineEmits(['save', 'close']);

const title = ref(props.todo?.title || '');
const description = ref(props.todo?.description || '');
const dueDate = ref(props.todo?.dueDate ? toDatetimeLocal(props.todo.dueDate) : '');

function handleSubmit() {
  if (!title.value.trim()) return;
  emit('save', {
    title: title.value,
    description: description.value || null,
    dueDate: dueDate.value ? new Date(dueDate.value).toISOString() : null,
  });
}
</script>

<template>
  <div class="todo-modal-overlay" @click="emit('close')">
    <form class="todo-modal" @click.stop @submit.prevent="handleSubmit">
      <h3>{{ todo ? '할 일 수정' : '할 일 추가' }}</h3>

      <label>
        제목
        <input v-model="title" type="text" maxlength="100" placeholder="할 일을 입력하세요" required />
      </label>

      <label>
        마감일 (선택)
        <input v-model="dueDate" type="datetime-local" />
      </label>

      <label>
        설명 (선택)
        <textarea v-model="description" maxlength="500" placeholder="설명"></textarea>
      </label>

      <div class="todo-modal-actions">
        <button type="button" @click="emit('close')">취소</button>
        <button type="submit">저장</button>
      </div>
    </form>
  </div>
</template>
