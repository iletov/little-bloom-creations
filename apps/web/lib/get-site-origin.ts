const LOCAL_DEVELOPMENT_ORIGIN = 'http://localhost:3000';

const isHttpOrigin = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export const getSiteOrigin = (): string => {
  if (typeof window !== 'undefined' && isHttpOrigin(window.location.origin)) {
    return window.location.origin;
  }

  const configuredOrigin = process.env.NEXT_PUBLIC_BASE_URL?.trim();

  if (configuredOrigin && isHttpOrigin(configuredOrigin)) {
    return new URL(configuredOrigin).origin;
  }

  return LOCAL_DEVELOPMENT_ORIGIN;
};
