import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.100.10.130"],
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.ceojacklearninghub.com" }],
        destination: "https://ceojacklearninghub.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
