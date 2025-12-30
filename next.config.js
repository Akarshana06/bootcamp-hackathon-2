/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    // This fixes the issue with `@` alias
    config.resolve.alias['@'] = __dirname;
    return config;
  },
};

module.exports = nextConfig;
