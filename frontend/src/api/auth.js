import http from './http';

export async function signup({ username, password, name }) {
  await http.post('/api/auth/signup', { username, password, name });
}

export async function login({ username, password }) {
  const { data } = await http.post('/api/auth/login', { username, password });
  return data;
}
