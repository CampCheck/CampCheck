export function getChecklistProgress(storageKey, checklist) {
  const saved = JSON.parse(localStorage.getItem(storageKey)) || {};

  const completed = checklist.filter(item => saved[item]).length;

  return {
    completed,
    total: checklist.length,
  };
}