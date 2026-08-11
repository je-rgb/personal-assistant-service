<script setup>
import { computed } from 'vue';
import { formatTime } from '../../utils/date';
import { useReminders } from '../../composables/useReminders';

const props = defineProps({
  date: { type: Date, required: true },
  events: { type: Array, required: true },
});

const emit = defineEmits(['add', 'edit', 'delete']);

const { getReminderMinutes } = useReminders();

const sortedEvents = computed(() =>
  [...props.events].sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
);
</script>

<template>
  <div class="day-event-list">
    <div class="day-list-header">
      <h3>{{ date.getMonth() + 1 }}월 {{ date.getDate() }}일 일정</h3>
      <button type="button" @click="emit('add')">+ 일정 추가</button>
    </div>

    <p v-if="sortedEvents.length === 0" class="no-events">등록된 일정이 없습니다.</p>

    <ul v-else class="event-items">
      <li
        v-for="ev in sortedEvents"
        :key="ev.id"
        class="event-item"
        :style="{ borderLeftColor: ev.color }"
      >
        <div class="event-item-main" @click="emit('edit', ev)">
          <span class="event-time">{{ formatTime(ev.startTime) }} - {{ formatTime(ev.endTime) }}</span>
          <span class="event-title">
            {{ ev.title }}
            <span v-if="getReminderMinutes(ev.id)" class="event-reminder-badge" title="리마인더 설정됨">🔔</span>
          </span>
          <p v-if="ev.description" class="event-desc">{{ ev.description }}</p>
        </div>
        <button type="button" class="delete-btn" @click="emit('delete', ev.id)">삭제</button>
      </li>
    </ul>
  </div>
</template>
