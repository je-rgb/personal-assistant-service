import http from './http';
import { toDatetimeLocal } from '../utils/date';

export async function getEvents(start, end) {
  const { data } = await http.get('/events', {
    params: { start: toDatetimeLocal(start), end: toDatetimeLocal(end) },
  });
  return data;
}

export async function createEvent(event) {
  const { data } = await http.post('/events', event);
  return data;
}

export async function updateEvent(id, event) {
  const { data } = await http.put(`/events/${id}`, event);
  return data;
}

export async function deleteEvent(id) {
  await http.delete(`/events/${id}`);
}
