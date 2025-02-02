/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.prevalentware.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
