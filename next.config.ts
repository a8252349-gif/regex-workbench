import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    cpus: 2,
    workerThreads: false,
    staticGenerationMaxConcurrency: 2,
    staticGenerationMinPagesPerWorker: 20
  }
};

export default nextConfig;
