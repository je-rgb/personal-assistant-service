import { ref, watch } from 'vue';
import { useAuth } from './useAuth';
import { getFiredNotifications, markNotificationFired, clearFiredNotification } from '../api/notifications';

const { username } = useAuth();

// 서버에 저장된 발동 기록 캐시: [{ sourceType, sourceId, firedKey }]
const firedList = ref([]);

async function load() {
  if (!username.value) {
    firedList.value = [];
    return;
  }
  try {
    firedList.value = await getFiredNotifications();
  } catch {
    // 네트워크 오류 시 다음 로그인/재시도에서 다시 불러온다
  }
}

load();
watch(username, load);

function matches(f, sourceType, sourceId, firedKey) {
  return f.sourceType === sourceType && f.sourceId === sourceId && f.firedKey === firedKey;
}

function isFired(sourceType, sourceId, firedKey) {
  return firedList.value.some((f) => matches(f, sourceType, sourceId, firedKey));
}

async function markFired(sourceType, sourceId, firedKey) {
  if (isFired(sourceType, sourceId, firedKey)) return;
  firedList.value.push({ sourceType, sourceId, firedKey });
  try {
    await markNotificationFired(sourceType, sourceId, firedKey);
  } catch {
    firedList.value = firedList.value.filter((f) => !matches(f, sourceType, sourceId, firedKey));
  }
}

async function clearFired(sourceType, sourceId, firedKey) {
  firedList.value = firedList.value.filter((f) => !matches(f, sourceType, sourceId, firedKey));
  try {
    await clearFiredNotification(sourceType, sourceId, firedKey);
  } catch {
    // 네트워크 오류 시 무시 (서버에는 기록이 남아있을 수 있음)
  }
}

export function useNotificationFired() {
  return { isFired, markFired, clearFired };
}
