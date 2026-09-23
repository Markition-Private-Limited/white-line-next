import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/services/one-way-ride',
        destination: '/services/city-to-city',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
