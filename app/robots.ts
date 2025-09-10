export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    rules: [
      {
        userAgent: '*',
        allow: isProduction ? baseUrl : '/',
        disallow: ['/admin/', '/api/', '/studio/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/studio/'],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
