import { ref, watch } from 'vue';
import { useAuth } from './useAuth';

const { username } = useAuth();

// eventId -> 알림을 보낼 분(minutes) 이전 값. 0 이하이면 저장하지 않음.
const reminderMap = ref({});
// 이미 알림을 보낸 "eventId:remindAtISO" 목록 (중복 알림 방지)
const firedReminders = ref([]);

let mapKey = '';
let firedKey = '';

function keys() {
  const user = username.value || 'guest';
  return { mapKey: `reminders:${user}`, firedKey: `firedReminders:${user}` };
}

function load() {
  const k = keys();
  mapKey = k.mapKey;
  firedKey = k.firedKey;
  try {
    reminderMap.value = JSON.parse(localStorage.getItem(mapKey)) || {};
  } catch {
    reminderMap.value = {};
  }
  try {
    firedReminders.value = JSON.parse(localStorage.getItem(firedKey)) || [];
  } catch {
    firedReminders.value = [];
  }
}

function persistMap() {
  localStorage.setItem(mapKey, JSON.stringify(reminderMap.value));
}

function persistFired() {
  localStorage.setItem(firedKey, JSON.stringify(firedReminders.value));
}

load();
watch(username, load);
watch(reminderMap, persistMap, { deep: true });
watch(firedReminders, persistFired, { deep: true });

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

function fireKeyFor(eventId, remindAt) {
  return `${eventId}:${remindAt}`;
}

function isFired(eventId, remindAt) {
  return firedReminders.value.includes(fireKeyFor(eventId, remindAt));
}

function markFired(eventId, remindAt) {
  firedReminders.value.push(fireKeyFor(eventId, remindAt));
  // 오래된 기록이 무한히 쌓이지 않도록 최근 200개만 유지
  if (firedReminders.value.length > 200) {
    firedReminders.value = firedReminders.value.slice(-200);
  }
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
