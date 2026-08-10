import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

export async function signup({ username, password, name }) {
  await api.post('/api/auth/signup', { username, password, name });
}

export async function login({ username, password }) {
  const { data } = await api.post('/api/auth/login', { username, password });
  return data;
}
