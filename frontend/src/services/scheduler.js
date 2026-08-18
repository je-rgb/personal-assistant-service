import { useAuth } from '../composables/useAuth';
import { useAlarms } from '../composables/useAlarms';
import { useReminders } from '../composables/useReminders';
import { useTodoNotifications } from '../composables/useTodoNotifications';
import { getEvents } from '../api/calendar';
import { getTodos } from '../api/todo';
import { notify, playChime } from './notification';

const TICK_MS = 20000;
const EVENT_REFRESH_TICKS = 3; // 약 60초마다 이벤트를 다시 불러온다
const TODO_REFRESH_TICKS = 3; // 약 60초마다 할 일을 다시 불러온다

const WEEKDAY_LABEL = ['일', '월', '화', '수', '목', '금', '토'];

let intervalId = null;

function formatTime(date) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function checkAlarms(now) {
  const { alarms, updateAlarm } = useAlarms();
  const currentTime = formatTime(now);
  const currentDay = now.getDay();
  const fireKey = `${now.toDateString()}_${currentTime}`;

  for (const alarm of alarms.value) {
    if (!alarm.enabled) continue;
    if (alarm.time !== currentTime) continue;
    if (alarm.days.length > 0 && !alarm.days.includes(currentDay)) continue;
    if (alarm.lastFiredKey === fireKey) continue;

    notify('⏰ 알람', alarm.label, { mediaUrl: '/media/alarm-clip.mp4' });
    playChime();
    updateAlarm(alarm.id, {
      lastFiredKey: fireKey,
      enabled: alarm.days.length === 0 ? false : alarm.enabled,
    });
  }
}

let eventsCache = [];
let tickCount = 0;

async function refreshEventsCache() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  try {
    eventsCache = await getEvents(start, end);
  } catch {
    // 네트워크 오류 시 다음 tick에서 재시도
  }
}

async function checkReminders(now) {
  if (tickCount % EVENT_REFRESH_TICKS === 0) {
    await refreshEventsCache();
  }

  const { computeDueReminders, markFired } = useReminders();
  const due = computeDueReminders(eventsCache, now);
  for (const { event, remindAt } of due) {
    const start = new Date(event.startTime);
    notify(
      '🔔 리마인더',
      `${event.title} - ${start.toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`
    );
    markFired(event.id, remindAt.toISOString());
  }
}

let todosCache = [];

async function refreshTodosCache() {
  try {
    todosCache = await getTodos();
  } catch {
    // 네트워크 오류 시 다음 tick에서 재시도
  }
}

async function checkTodos(now) {
  if (tickCount % TODO_REFRESH_TICKS === 0) {
    await refreshTodosCache();
  }

  const { computeDueTodos, markFired } = useTodoNotifications();
  const due = computeDueTodos(todosCache, now);
  for (const todo of due) {
    notify('✅ 할 일', `${todo.title} - 마감 시간이 지났습니다.`, { mediaUrl: '/media/alarm-clip.mp4' });
    markFired(todo.id);
  }
}

async function tick() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated.value) return;

  const now = new Date();
  checkAlarms(now);
  await checkReminders(now);
  await checkTodos(now);
  tickCount += 1;
}

export function startScheduler() {
  if (intervalId) return;
  tick();
  intervalId = setInterval(tick, TICK_MS);
}

export function stopScheduler() {
  clearInterval(intervalId);
  intervalId = null;
}

export { WEEKDAY_LABEL };
