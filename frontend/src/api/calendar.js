import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8080' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function getEvents(start, end) {
  const { data } = await api.get('/api/events', {
    params: { start: start.toISOString(), end: end.toISOString() },
  });
  return data;
}

export async function createEvent(event) {
  const { data } = await api.post('/api/events', event);
  return data;
}

export async function updateEvent(id, event) {
  const { data } = await api.put(`/api/events/${id}`, event);
  return data;
}

export async function deleteEvent(id) {
  await api.delete(`/api/events/${id}`);
}