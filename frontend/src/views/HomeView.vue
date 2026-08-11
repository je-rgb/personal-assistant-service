<script setup>
import { useAuth } from '../composables/useAuth';

const { isAuthenticated, username } = useAuth();
</script>

<template>
  <main class="home-page">
    <h1>Personal Assistant</h1>
    <template v-if="isAuthenticated">
      <p>{{ username }}님, 환영합니다.</p>
      <div class="home-links">
        <router-link to="/calendar">캘린더로 이동</router-link>
        <router-link to="/alarms">알람으로 이동</router-link>
      </div>
    </template>
    <p v-else>
      <router-link to="/login">로그인</router-link> 또는
      <router-link to="/signup">회원가입</router-link>
    </p>
  </main>
</template>
