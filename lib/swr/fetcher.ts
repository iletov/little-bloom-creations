export const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then(res => {
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  });

export async function updateFavorite(
  url: string,
  { arg }: { arg: { productId: string; action: 'add' | 'remove' } },
) {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  }).then(res => {
    if (!res.ok) throw new Error('Failed to update favorites');
    return res.json();
  });
}
