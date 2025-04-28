import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uwvmzebvletcogpgnrsh.supabase.co",
      }
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb"
    },
  },
};

export default nextConfig;
