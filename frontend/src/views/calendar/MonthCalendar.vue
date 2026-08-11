<script setup>
import { computed } from 'vue';
import { toDateKey, isSameDay } from '../../utils/date';

const props = defineProps({
  currentMonth: { type: Date, required: true },
  selectedDate: { type: Date, required: true },
  eventsByDate: { type: Object, required: true },
});

const emit = defineEmits(['select-date', 'prev-month', 'next-month', 'today']);

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const year = computed(() => props.currentMonth.getFullYear());
const month = computed(() => props.currentMonth.getMonth());

const cells = computed(() => {
  const firstDayOfMonth = new Date(year.value, month.value, 1);
  const startWeekday = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year.value, month.value + 1, 0).getDate();

  const list = [];
  for (let i = 0; i < startWeekday; i++) list.push(null);
  for (let d = 1; d <= daysInMonth; d++) list.push(new Date(year.value, month.value, d));
  return list;
});

const today = new Date();

function hasEvents(date) {
  return (props.eventsByDate[toDateKey(date)] || []).length > 0;
}
</script>

<template>
  <div class="month-calendar">
    <div class="month-header">
      <button type="button" @click="emit('prev-month')">&lt;</button>
      <h2>{{ year }}년 {{ month + 1 }}월</h2>
      <button type="button" @click="emit('next-month')">&gt;</button>
      <button type="button" class="today-btn" @click="emit('today')">오늘</button>
    </div>

    <div class="weekday-row">
      <div v-for="w in WEEKDAYS" :key="w" class="weekday-cell">{{ w }}</div>
    </div>

    <div class="days-grid">
      <div
        v-for="(date, idx) in cells"
        :key="idx"
        :class="[
          'day-cell',
          date
            ? { selected: isSameDay(date, selectedDate), today: isSameDay(date, today) }
            : 'empty',
        ]"
        @click="date && emit('select-date', date)"
      >
        <template v-if="date">
          <span class="day-number">{{ date.getDate() }}</span>
          <span v-if="hasEvents(date)" class="event-dot" />
        </template>
      </div>
    </div>
  </div>
</template>
