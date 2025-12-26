const nextConfig = {
  experimental: {
    typedRoutes: true
  },
  // API 라우트 캐싱 비활성화
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0',
          },
          {
            key: 'x-vercel-cache-control',
            value: 'no-cache',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

