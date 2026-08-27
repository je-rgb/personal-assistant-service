import http from './http';

export async function getFiredNotifications() {
  const { data } = await http.get('/notifications/fired');
  return data;
}

export async function markNotificationFired(sourceType, sourceId, firedKey) {
  const { data } = await http.post('/notifications/fired', { sourceType, sourceId, firedKey });
  return data;
}

export async function clearFiredNotification(sourceType, sourceId, firedKey) {
  await http.delete('/notifications/fired', { params: { sourceType, sourceId, firedKey } });
}
