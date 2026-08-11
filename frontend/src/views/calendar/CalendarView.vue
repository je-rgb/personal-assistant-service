<script setup>
import { ref, computed, watch } from 'vue';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../api/calendar';
import { useReminders } from '../../composables/useReminders';
import { toDateKey } from '../../utils/date';
import MonthCalendar from './MonthCalendar.vue';
import DayEventList from './DayEventList.vue';
import EventModal from './EventModal.vue';
import '../../assets/calendar.css';

const { setReminderMinutes, getReminderMinutes } = useReminders();

const currentMonth = ref(new Date());
const selectedDate = ref(new Date());
const events = ref([]);
const modalOpen = ref(false);
const editingEvent = ref(null);

const monthStart = computed(() => {
  const d = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), 1);
  d.setHours(0, 0, 0, 0);
  return d;
});

const monthEnd = computed(() => {
  const d = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 1);
  d.setHours(0, 0, 0, 0);
  return d;
});

async function loadEvents() {
  events.value = await getEvents(monthStart.value, monthEnd.value);
}

watch([monthStart, monthEnd], loadEvents, { immediate: true });

const eventsByDate = computed(() => {
  const map = {};
  for (const ev of events.value) {
    const key = toDateKey(new Date(ev.startTime));
    if (!map[key]) map[key] = [];
    map[key].push(ev);
  }
  return map;
});

const selectedDayEvents = computed(() => eventsByDate.value[toDateKey(selectedDate.value)] || []);

function openCreateModal() {
  editingEvent.value = null;
  modalOpen.value = true;
}

function openEditModal(event) {
  editingEvent.value = event;
  modalOpen.value = true;
}

function closeModal() {
  modalOpen.value = false;
  editingEvent.value = null;
}

async function handleSave(formData) {
  const { reminderMinutes, ...payload } = formData;
  let saved;
  if (editingEvent.value) {
    saved = await updateEvent(editingEvent.value.id, payload);
    window.alert('일정이 수정되었습니다.');
  } else {
    saved = await createEvent(payload);
    window.alert('일정이 등록되었습니다.');
  }
  setReminderMinutes(saved.id, reminderMinutes);
  closeModal();
  loadEvents();
}

async function handleDelete(id) {
  await deleteEvent(id);
  setReminderMinutes(id, 0);
  window.alert('일정이 삭제되었습니다.');
  loadEvents();
}

function goToPrevMonth() {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() - 1, 1);
}

function goToNextMonth() {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 1);
}

function goToToday() {
  const t = new Date();
  currentMonth.value = t;
  selectedDate.value = t;
}
</script>

<template>
  <div class="calendar-app">
    <MonthCalendar
      :current-month="currentMonth"
      :selected-date="selectedDate"
      :events-by-date="eventsByDate"
      @select-date="selectedDate = $event"
      @prev-month="goToPrevMonth"
      @next-month="goToNextMonth"
      @today="goToToday"
    />
    <DayEventList
      :date="selectedDate"
      :events="selectedDayEvents"
      @add="openCreateModal"
      @edit="openEditModal"
      @delete="handleDelete"
    />
    <EventModal
      v-if="modalOpen"
      :date="selectedDate"
      :event="editingEvent"
      :reminder-minutes="editingEvent ? getReminderMinutes(editingEvent.id) : 0"
      @save="handleSave"
      @close="closeModal"
    />
  </div>
</template>
