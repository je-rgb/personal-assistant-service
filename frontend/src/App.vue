<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from './composables/useAuth';
import { toasts } from './composables/useToast';
import { startScheduler } from './services/scheduler';
import { requestPermission } from './services/notification';

const { isAuthenticated, logout } = useAuth();
const router = useRouter();

function handleLogout() {
  logout();
  router.push('/login');
}

onMounted(() => {
  startScheduler();
  requestPermission().catch(() => {});
});
</script>

<template>
  <nav class="top-nav">
    <router-link class="brand" to="/">Personal Assistant</router-link>
    <template v-if="isAuthenticated">
      <router-link to="/calendar">캘린더</router-link>
      <router-link to="/alarms">알람</router-link>
      <button class="logout-btn" type="button" @click="handleLogout">로그아웃</button>
    </template>
    <template v-else>
      <router-link to="/login">로그인</router-link>
      <router-link to="/signup">회원가입</router-link>
    </template>
  </nav>

  <router-view />

  <div class="toast-stack">
    <div v-for="toast in toasts" :key="toast.id" class="toast">{{ toast.message }}</div>
  </div>
</template>
