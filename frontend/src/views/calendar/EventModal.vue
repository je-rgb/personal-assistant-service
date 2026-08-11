<script setup>
import { ref } from 'vue';
import { toDatetimeLocal } from '../../utils/date';

const props = defineProps({
  date: { type: Date, required: true },
  event: { type: Object, default: null },
  reminderMinutes: { type: Number, default: 0 },
});

const emit = defineEmits(['save', 'close']);

const defaultStart = props.event
  ? new Date(props.event.startTime)
  : new Date(props.date.getFullYear(), props.date.getMonth(), props.date.getDate(), 9, 0, 0);
const defaultEnd = props.event
  ? new Date(props.event.endTime)
  : new Date(props.date.getFullYear(), props.date.getMonth(), props.date.getDate(), 10, 0, 0);

const title = ref(props.event?.title || '');
const startTime = ref(toDatetimeLocal(defaultStart));
const endTime = ref(toDatetimeLocal(defaultEnd));
const description = ref(props.event?.description || '');
const color = ref(props.event?.color || '#ff6fb0');
const reminder = ref(props.reminderMinutes || 0);
const error = ref('');

const REMINDER_OPTIONS = [
  { label: '알림 없음', value: 0 },
  { label: '5분 전', value: 5 },
  { label: '10분 전', value: 10 },
  { label: '30분 전', value: 30 },
  { label: '1시간 전', value: 60 },
  { label: '1일 전', value: 1440 },
];

function handleSubmit() {
  if (new Date(endTime.value) <= new Date(startTime.value)) {
    error.value = '종료 시간은 시작 시간보다 늦어야 합니다.';
    return;
  }
  emit('save', {
    title: title.value,
    startTime: new Date(startTime.value).toISOString(),
    endTime: new Date(endTime.value).toISOString(),
    description: description.value,
    color: color.value,
    reminderMinutes: reminder.value,
  });
}
</script>

<template>
  <div class="modal-overlay" @click="emit('close')">
    <form class="event-modal" @click.stop @submit.prevent="handleSubmit">
      <h3>{{ event ? '일정 수정' : '일정 등록' }}</h3>

      <p v-if="error" class="modal-error">{{ error }}</p>

      <label>
        제목
        <input v-model="title" required maxlength="100" />
      </label>

      <label>
        시작 시간
        <input v-model="startTime" type="datetime-local" required />
      </label>

      <label>
        종료 시간
        <input v-model="endTime" type="datetime-local" required />
      </label>

      <label>
        색상
        <input v-model="color" type="color" />
      </label>

      <label>
        리마인더
        <select v-model.number="reminder">
          <option v-for="opt in REMINDER_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </label>

      <label>
        메모
        <textarea v-model="description" maxlength="500" rows="3" />
      </label>

      <div class="modal-actions">
        <button type="button" @click="emit('close')">취소</button>
        <button type="submit">저장</button>
      </div>
    </form>
  </div>
</template>
