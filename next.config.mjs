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
  },
})(nextConfig)

