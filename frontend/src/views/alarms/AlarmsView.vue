<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAlarms } from '../../composables/useAlarms';
import { getPermission, requestPermission } from '../../services/notification';
import AlarmModal from './AlarmModal.vue';
import '../../assets/alarms.css';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const { alarms, addAlarm, updateAlarm, removeAlarm, toggleAlarm } = useAlarms();

const modalOpen = ref(false);
const editingAlarm = ref(null);
const permission = ref(getPermission());

onMounted(() => {
  permission.value = getPermission();
});

function daysLabel(days) {
  if (!days || days.length === 0) return '한 번만';
  if (days.length === 7) return '매일';
  return days
    .slice()
    .sort()
    .map((d) => WEEKDAYS[d])
    .join(', ');
}

function openCreateModal() {
  editingAlarm.value = null;
  modalOpen.value = true;
}

function openEditModal(alarm) {
  editingAlarm.value = alarm;
  modalOpen.value = true;
}

function closeModal() {
  modalOpen.value = false;
  editingAlarm.value = null;
}

function handleSave(data) {
  if (editingAlarm.value) {
    updateAlarm(editingAlarm.value.id, { ...data, lastFiredKey: null });
  } else {
    addAlarm(data);
  }
  closeModal();
}

async function handleRequestPermission() {
  permission.value = await requestPermission();
}
</script>

<template>
  <div class="alarms-page">
    <div class="alarms-header">
      <h1>알람</h1>
      <button type="button" @click="openCreateModal">+ 알람 추가</button>
    </div>

    <div v-if="permission !== 'granted'" class="permission-banner">
      <span>브라우저 알림을 허용하면 알람과 리마인더를 데스크톱 알림으로도 받을 수 있어요.</span>
      <button type="button" @click="handleRequestPermission">알림 허용</button>
    </div>

    <p v-if="alarms.length === 0" class="no-alarms">등록된 알람이 없습니다.</p>

    <ul v-else class="alarm-list">
      <li v-for="alarm in alarms" :key="alarm.id" :class="['alarm-item', { disabled: !alarm.enabled }]">
        <div class="alarm-info" @click="openEditModal(alarm)">
          <span class="alarm-time">{{ alarm.time }}</span>
          <span class="alarm-label">{{ alarm.label }}</span>
          <span class="alarm-days">{{ daysLabel(alarm.days) }}</span>
        </div>
        <div class="alarm-actions">
          <label class="switch">
            <input type="checkbox" :checked="alarm.enabled" @change="toggleAlarm(alarm.id)" />
            <span class="switch-track"></span>
          </label>
          <button type="button" class="delete-btn" @click="removeAlarm(alarm.id)">삭제</button>
        </div>
      </li>
    </ul>

    <AlarmModal v-if="modalOpen" :alarm="editingAlarm" @save="handleSave" @close="closeModal" />
  </div>
</template>
