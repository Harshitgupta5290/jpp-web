/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/**',
      },
    ],
  },
  experimental: {},
  webpack: (config, { dev }) => {
    if (dev) {
      // Use in-memory cache in dev — prevents stale chunk ID errors after hot reload
      config.cache = { type: 'memory' }
    }
    return config
  },
}

export default nextConfig
