/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "/s2/**",
      },
      {
        protocol: "https",
        hostname: "api.qrserver.com",
        pathname: "/v1/**",
      },
    ],
  },
};

export default nextConfig;
