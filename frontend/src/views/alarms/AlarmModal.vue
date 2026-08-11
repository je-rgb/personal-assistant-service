<script setup>
import { ref } from 'vue';

const props = defineProps({
  alarm: { type: Object, default: null },
});

const emit = defineEmits(['save', 'close']);

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const label = ref(props.alarm?.label || '');
const time = ref(props.alarm?.time || '08:00');
const days = ref([...(props.alarm?.days || [])]);

function toggleDay(day) {
  if (days.value.includes(day)) {
    days.value = days.value.filter((d) => d !== day);
  } else {
    days.value = [...days.value, day].sort();
  }
}

function handleSubmit() {
  emit('save', { label: label.value || '알람', time: time.value, days: days.value });
}
</script>

<template>
  <div class="alarm-modal-overlay" @click="emit('close')">
    <form class="alarm-modal" @click.stop @submit.prevent="handleSubmit">
      <h3>{{ alarm ? '알람 수정' : '알람 추가' }}</h3>

      <label>
        이름
        <input v-model="label" type="text" maxlength="30" placeholder="예: 기상 알람" />
      </label>

      <label>
        시간
        <input v-model="time" type="time" required />
      </label>

      <label>
        반복 요일 (선택 안 하면 한 번만 울림)
        <div class="day-toggle-row">
          <button
            v-for="(w, idx) in WEEKDAYS"
            :key="idx"
            type="button"
            :class="['day-toggle', { active: days.includes(idx) }]"
            @click="toggleDay(idx)"
          >
            {{ w }}
          </button>
        </div>
      </label>

      <div class="alarm-modal-actions">
        <button type="button" @click="emit('close')">취소</button>
        <button type="submit">저장</button>
      </div>
    </form>
  </div>
</template>
