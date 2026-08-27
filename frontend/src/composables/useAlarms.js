import { ref, watch } from 'vue';
import { useAuth } from './useAuth';
import { useNotificationFired } from './useNotificationFired';

const { username } = useAuth();
const { isFired, markFired } = useNotificationFired();

const alarms = ref([]);
let currentKey = '';

function storageKey() {
  return `alarms:${username.value || 'guest'}`;
}

function load() {
  currentKey = storageKey();
  try {
    alarms.value = JSON.parse(localStorage.getItem(currentKey)) || [];
  } catch {
    alarms.value = [];
  }
}

function persist() {
  localStorage.setItem(currentKey, JSON.stringify(alarms.value));
}

load();
watch(username, load);
watch(alarms, persist, { deep: true });

let nextId = Date.now();

function addAlarm({ label, time, days }) {
  alarms.value.push({
    id: nextId++,
    label: label || '알람',
    time,
    days: [...days],
    enabled: true,
  });
}

function updateAlarm(id, patch) {
  const alarm = alarms.value.find((a) => a.id === id);
  if (alarm) Object.assign(alarm, patch);
}

function removeAlarm(id) {
  alarms.value = alarms.value.filter((a) => a.id !== id);
}

function toggleAlarm(id) {
  const alarm = alarms.value.find((a) => a.id === id);
  if (alarm) alarm.enabled = !alarm.enabled;
}

function isAlarmFired(alarmId, fireKey) {
  return isFired('ALARM', alarmId, fireKey);
}

function markAlarmFired(alarmId, fireKey) {
  return markFired('ALARM', alarmId, fireKey);
}

export function useAlarms() {
  return { alarms, addAlarm, updateAlarm, removeAlarm, toggleAlarm, isAlarmFired, markAlarmFired };
}
