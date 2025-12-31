import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // используем новый компилятор React
  reactCompiler: true,
  // правила переадресации API-запросов на FastAPI
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/:path*",
      },
    ];
  },
};

export default nextConfig;
