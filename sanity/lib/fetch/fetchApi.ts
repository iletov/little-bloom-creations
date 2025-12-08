export const fetchSanityDataApi = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch data from API route');
  return res.json();
};
