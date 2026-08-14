import http from './http';

export async function checkUsername(loginId) {
  const { data } = await http.get('/auth/check-username', { params: { username: loginId } });
  return data.available;
}

export async function signup({ loginId, password, name }) {
  await http.post('/auth/signup', { username: loginId, password, name });
}

export async function login({ loginId, password }) {
  const { data } = await http.post('/auth/login', { username: loginId, password });
  return data;
}
