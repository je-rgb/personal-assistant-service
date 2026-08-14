<script setup>
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { signup, checkUsername } from '../api/auth';
import '../assets/auth.css';

const router = useRouter();

const form = reactive({ loginId: '', password: '', name: '' });
const confirmPassword = ref('');
const loading = ref(false);
const checking = ref(false);
const usernameAvailable = ref(null);
const usernameCheckMessage = ref('');

function handleLoginIdInput() {
  usernameAvailable.value = null;
  usernameCheckMessage.value = '';
}

async function handleCheckUsername() {
  if (!form.loginId) return;
  checking.value = true;
  try {
    const available = await checkUsername(form.loginId);
    usernameAvailable.value = available;
    usernameCheckMessage.value = available ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.';
  } catch {
    usernameAvailable.value = null;
    usernameCheckMessage.value = '중복확인에 실패했습니다.';
  } finally {
    checking.value = false;
  }
}

const passwordMismatch = computed(() => confirmPassword.value.length > 0 && confirmPassword.value !== form.password);

async function handleSubmit() {
  if (usernameAvailable.value !== true) {
    alert('아이디 중복확인을 해주세요.');
    return;
  }
  if (confirmPassword.value !== form.password) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }
  loading.value = true;
  try {
    await signup(form);
    router.push('/login');
  } catch (err) {
    const message = err.response?.data?.message || err.response?.data;
    alert(typeof message === 'string' && message ? message : '회원가입에 실패했습니다.');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="auth-page">
    <form class="auth-form" @submit.prevent="handleSubmit">
      <h1>회원가입</h1>

      <label>
        ID
        <div class="id-check-row">
          <input
            v-model="form.loginId"
            type="text"
            required
            autocomplete="username"
            @input="handleLoginIdInput"
          />
          <button type="button" class="check-btn" :disabled="checking || !form.loginId" @click="handleCheckUsername">
            {{ checking ? '확인 중...' : '중복확인' }}
          </button>
        </div>
        <span
          v-if="usernameCheckMessage"
          :class="['field-hint', usernameAvailable ? 'success' : 'error']"
        >
          {{ usernameCheckMessage }}
        </span>
      </label>

      <label>
        Password
        <input v-model="form.password" type="password" required minlength="8" autocomplete="new-password" />
      </label>

      <label>
        Password 확인
        <input v-model="confirmPassword" type="password" required minlength="8" autocomplete="new-password" />
        <span v-if="passwordMismatch" class="field-hint error">비밀번호가 일치하지 않습니다.</span>
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
