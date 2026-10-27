import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Gevelreiniging bieden we niet aan; oude links uit Google komen bij de diensten uit.
      { source: "/diensten/gevelreiniging", destination: "/diensten", permanent: true },
    ];
  },
};

export default nextConfig;
