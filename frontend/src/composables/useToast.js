import { reactive } from 'vue';

let nextId = 1;
export const toasts = reactive([]);

export function pushToast(message, duration = 5000, options = {}) {
  const id = nextId++;
  toasts.push({ id, message, mediaUrl: options.mediaUrl || null });
  setTimeout(() => {
    const idx = toasts.findIndex((t) => t.id === id);
    if (idx !== -1) toasts.splice(idx, 1);
  }, duration);
}
