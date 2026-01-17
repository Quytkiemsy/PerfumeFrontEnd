import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['www.ft.com', 'www.mcaffeine.com', 'encrypted-tbn0.gstatic.com', 'encrypted-tbn0.gstatic.com','localhost'], // <-- khai báo domain ảnh
  },
};

export default nextConfig;
