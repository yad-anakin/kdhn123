/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  // Skip ESLint during production builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Skip TypeScript type checking errors during builds
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
