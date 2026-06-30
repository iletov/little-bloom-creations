'use client';

import QueryProvider from './query-provider';

interface QueryProviderProps {
  children: React.ReactNode;
}
export default function LayoutWrapper({ children }: QueryProviderProps) {
  return <QueryProvider>{children}</QueryProvider>;
}
