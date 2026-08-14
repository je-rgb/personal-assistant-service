import { computed, ref } from 'vue';
import { decodeJwtPayload, isTokenExpired } from '../utils/jwt';

const storedToken = localStorage.getItem('token') || '';
const token = ref(!storedToken || isTokenExpired(storedToken) ? '' : storedToken);
if (storedToken && !token.value) {
  localStorage.removeItem('token');
}

const username = computed(() => {
  const payload = decodeJwtPayload(token.value);
  return payload?.sub || '';
});

const isAuthenticated = computed(() => !!token.value && !isTokenExpired(token.value));

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
