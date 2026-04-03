import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/laicai',
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['30.50.130.109'],
};

export default nextConfig;
