/*
【執筆メモStart】
yarn create next-appで自動生成されたものを変更しています。


■変更点
rewritesでバックエンドへの疎通を設定しました。

【執筆メモEnd】
*/
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://host.docker.internal:8000/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
