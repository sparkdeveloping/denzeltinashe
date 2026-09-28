/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];

const nextConfig = {
  outputFileTracingIncludes: {
    '/api/portal/file/*': ['./data/files/**/*'],
    '/clients/*': ['./data/portal.json'],
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/gabby', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, noimageindex' }] },
      { source: '/clients/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, noimageindex' }] },
      { source: '/api/portal/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, noimageindex' }, { key: 'Cache-Control', value: 'private, no-store' }] },
      { source: '/client/gabby/preview/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
      { source: '/client/gabby/downloads/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }, { key: 'Content-Disposition', value: 'attachment' }] },
      { source: '/client/gabby/Gabby-Final-Gallery.zip', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }, { key: 'Content-Disposition', value: 'attachment; filename="Gabby-Final-Gallery.zip"' }] },
    ];
  },
};

export default nextConfig;
