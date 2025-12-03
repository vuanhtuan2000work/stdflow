import withPWA from '@ducanh2912/next-pwa'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure for webpack (PWA plugin requires webpack)
  // Turbopack is default in Next.js 16, but PWA plugin needs webpack
  webpack: (config, { isServer }) => {
    // PWA plugin will add its webpack config
    return config
  },
  // Add empty turbopack config to silence the warning
  // We're using webpack for PWA support
  turbopack: {},
}

export default withPWA({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
    // Fix TrustedScript errors by using safe strategies
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif|webp)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      },
    ],
  },
  // Disable service worker registration in development
  // This prevents TrustedScript errors during dev
  register: process.env.NODE_ENV === 'production',
})(nextConfig)

