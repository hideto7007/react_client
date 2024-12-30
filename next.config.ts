import { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://host.docker.internal:8081/api/:path*", // Dockerからホストマシンにアクセス
      },
    ];
  },
};

// TODO
// ローカルサーバーで実行する際のIP http://localhost:8080
// dockerコンテナ起動した際のIP http://host.docker.internal:8080

export default nextConfig;
