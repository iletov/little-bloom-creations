export function formatTime(ms: string | number) {
  const date = new Date(ms);
  return date.toLocaleTimeString('bg-BG', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
