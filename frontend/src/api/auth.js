import http from './http';

export async function signup({ username, password, name }) {
  await http.post('/auth/signup', { username, password, name });
}

export async function login({ username, password }) {
  const { data } = await http.post('/auth/login', { username, password });
  return data;
}
