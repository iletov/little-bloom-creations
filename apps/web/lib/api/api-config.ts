const rawApiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

if (!rawApiBaseUrl) {
  throw new Error('Missing required public environment variable: NEXT_PUBLIC_API_URL');
}

export const apiConfig = {
  baseUrl: rawApiBaseUrl.replace(/\/+$/, ''),
} as const;
