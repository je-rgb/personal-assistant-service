import { computed, ref } from 'vue';
import { decodeJwtPayload } from '../utils/jwt';

const token = ref(localStorage.getItem('token') || '');

const username = computed(() => {
  const payload = decodeJwtPayload(token.value);
  return payload?.sub || '';
});

const isAuthenticated = computed(() => !!token.value);

function setToken(newToken) {
  token.value = newToken;
  localStorage.setItem('token', newToken);
}

function logout() {
  token.value = '';
  localStorage.removeItem('token');
}

export function useAuth() {
  return { token, username, isAuthenticated, setToken, logout };
}
