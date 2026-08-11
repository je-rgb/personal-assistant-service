<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../api/auth';
import { useAuth } from '../composables/useAuth';
import '../assets/auth.css';

const router = useRouter();
const { setToken } = useAuth();

const form = reactive({ username: '', password: '' });
const error = ref('');
const loading = ref(false);

async function handleSubmit() {
  error.value = '';
  loading.value = true;
  try {
    const { token } = await login(form);
    setToken(token);
    router.push('/');
  } catch (err) {
    const message = err.response?.data?.message || err.response?.data;
    error.value = typeof message === 'string' ? message : '로그인에 실패했습니다.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="auth-page">
    <form class="auth-form" @submit.prevent="handleSubmit">
      <h1>로그인</h1>

      <p v-if="error" class="auth-error">{{ error }}</p>

      <label>
        ID
        <input v-model="form.username" type="text" required autocomplete="username" />
      </label>

      <label>
        Password
        <input v-model="form.password" type="password" required autocomplete="current-password" />
      </label>

      <button type="submit" :disabled="loading">{{ loading ? '처리 중...' : '로그인' }}</button>

      <p class="auth-link">계정이 없으신가요? <router-link to="/signup">회원가입</router-link></p>
    </form>
  </div>
</template>
