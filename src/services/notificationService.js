// Foundation for future trip, shopping and checklist reminders.
// Keeping this boundary separate means a push provider can be added later
// without changing feature pages.
export function isNotificationSupported() {
  return "Notification" in window;
}

export async function requestNotificationPermission() {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.requestPermission();
}

export function scheduleNotification() {
  // Intentionally reserved for the future notification provider.
  return null;
}
