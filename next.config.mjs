/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === "development";

const nextConfig = {
  // Prevent Next dev hot-reloader from attempting new URL("")
  // in browser runtimes where this can surface as a local exception.
  assetPrefix: isDev ? "http://localhost:3000" : undefined,
};

export default nextConfig;
