import http from './http';

export async function getEvents(start, end) {
  const { data } = await http.get('/api/events', {
    params: { start: start.toISOString(), end: end.toISOString() },
  });
  return data;
}

export async function createEvent(event) {
  const { data } = await http.post('/api/events', event);
  return data;
}

export async function updateEvent(id, event) {
  const { data } = await http.put(`/api/events/${id}`, event);
  return data;
}

export async function deleteEvent(id) {
  await http.delete(`/api/events/${id}`);
}
