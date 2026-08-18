import { pushToast } from '../composables/useToast';

export function isNotificationSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getPermission() {
  return isNotificationSupported() ? Notification.permission : 'unsupported';
}

export async function requestPermission() {
  if (!isNotificationSupported()) return 'unsupported';
  if (Notification.permission === 'default') {
    return Notification.requestPermission();
  }
  return Notification.permission;
}

export function notify(title, body, options = {}) {
  if (isNotificationSupported() && Notification.permission === 'granted') {
    new Notification(title, { body });
  }
  pushToast(body ? `${title} - ${body}` : title, undefined, options);
}

export function playChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    [880, 1108].forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.35);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start(ctx.currentTime + i * 0.18);
      oscillator.stop(ctx.currentTime + i * 0.18 + 0.35);
    });
    setTimeout(() => ctx.close(), 1000);
  } catch {
    // 오디오 재생을 지원하지 않는 환경은 무시
  }
}
