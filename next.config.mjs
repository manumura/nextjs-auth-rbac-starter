/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
    ],
  },
  // output: "standalone",
  // output: 'export',
  // distDir: 'dist',
  // basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
};

export default nextConfig;
