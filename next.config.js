const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@rainbow-me/rainbowkit'],
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**faceit**',
        port: '',           // leave empty unless you use a non-standard port
        pathname: '/**',    // allows any path under this domain (most flexible)
      },
    ],
  },
};

module.exports = withVanillaExtract(nextConfig);