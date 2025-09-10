export function isOfficeOpen(
  from: number,
  to: number,
): 'затворено' | 'отвоерено' {
  const now = Date.now(); // current time in ms
  return now >= from && now <= to ? 'затворено' : 'отвоерено';
}
