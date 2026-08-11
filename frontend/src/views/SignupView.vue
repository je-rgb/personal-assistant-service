<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { signup } from '../api/auth';
import '../assets/auth.css';

const router = useRouter();

const form = reactive({ username: '', password: '', name: '' });
const error = ref('');
const loading = ref(false);

async function handleSubmit() {
  error.value = '';
  loading.value = true;
  try {
    await signup(form);
    router.push('/login');
  } catch (err) {
    const message = err.response?.data?.message || err.response?.data;
    error.value = typeof message === 'string' ? message : '회원가입에 실패했습니다.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="auth-page">
    <form class="auth-form" @submit.prevent="handleSubmit">
      <h1>회원가입</h1>

      <p v-if="error" class="auth-error">{{ error }}</p>

      <label>
        ID
        <input v-model="form.username" type="text" required autocomplete="username" />
      </label>

      <label>
        Password
        <input v-model="form.password" type="password" required minlength="8" autocomplete="new-password" />
      </label>

      <label>
        Name
        <input v-model="form.name" type="text" required maxlength="50" autocomplete="name" />
      </label>

      <button type="submit" :disabled="loading">{{ loading ? '처리 중...' : '가입하기' }}</button>

      <p class="auth-link">이미 계정이 있으신가요? <router-link to="/login">로그인</router-link></p>
    </form>
  </div>
</template>
