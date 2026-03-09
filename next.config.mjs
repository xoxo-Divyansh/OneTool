const isDev = process.env.NODE_ENV !== "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  assetPrefix:
    !isDev && process.env.NEXT_PUBLIC_ASSET_PREFIX
      ? process.env.NEXT_PUBLIC_ASSET_PREFIX
      : undefined,
};

export default nextConfig;