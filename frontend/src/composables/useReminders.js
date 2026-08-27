import { ref, watch } from 'vue';
import { useAuth } from './useAuth';
import { useNotificationFired } from './useNotificationFired';

const { username } = useAuth();
const { isFired: isNotificationFired, markFired: markNotificationFired } = useNotificationFired();

// eventId -> 알림을 보낼 분(minutes) 이전 값. 0 이하이면 저장하지 않음.
const reminderMap = ref({});

let mapKey = '';

function keyOf() {
  return `reminders:${username.value || 'guest'}`;
}

function load() {
  mapKey = keyOf();
  try {
    reminderMap.value = JSON.parse(localStorage.getItem(mapKey)) || {};
  } catch {
    reminderMap.value = {};
  }
}

function persistMap() {
  localStorage.setItem(mapKey, JSON.stringify(reminderMap.value));
}

load();
watch(username, load);
watch(reminderMap, persistMap, { deep: true });

function getReminderMinutes(eventId) {
  return reminderMap.value[eventId] || 0;
}

function setReminderMinutes(eventId, minutes) {
  if (minutes > 0) {
    reminderMap.value[eventId] = minutes;
  } else {
    delete reminderMap.value[eventId];
  }
}

function isFired(eventId, remindAt) {
  return isNotificationFired('REMINDER', eventId, remindAt);
}

function markFired(eventId, remindAt) {
  return markNotificationFired('REMINDER', eventId, remindAt);
}

// 이벤트 목록을 받아 지금 알림을 보내야 하는 이벤트들을 계산한다.
function computeDueReminders(events, now = new Date()) {
  const due = [];
  for (const event of events) {
    const minutes = getReminderMinutes(event.id);
    if (!minutes) continue;
    const start = new Date(event.startTime);
    const remindAt = new Date(start.getTime() - minutes * 60000);
    if (remindAt > now || start <= now) continue;
    if (isFired(event.id, remindAt.toISOString())) continue;
    due.push({ event, remindAt, minutes });
  }
  return due;
}

export function useReminders() {
  return {
    getReminderMinutes,
    setReminderMinutes,
    computeDueReminders,
    markFired,
  };
}
