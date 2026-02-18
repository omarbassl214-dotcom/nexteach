/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/nexteach',
  assetPrefix: '/nexteach/',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;

