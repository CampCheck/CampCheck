export function getChecklistProgress(storageKey, items) {
  const checks = JSON.parse(localStorage.getItem(storageKey)) || {};

  const completed = items.filter((item) => checks[item]).length;

  return {
    completed,
    total: items.length,
  };
}