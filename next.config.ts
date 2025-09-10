import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['cdn.sanity.io', 'images.unsplash.com'],
  },
  // experimental: {
  //   webpackMemoryOptimizations: true,
  // },
};

export default nextConfig;
