const getRequiredPublicEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required public environment variable: ${key}`);
  }

  return value.replace(/\/+$/, '');
};

export const apiConfig = {
  baseUrl: getRequiredPublicEnv('NEXT_PUBLIC_API_URL'),
} as const;
