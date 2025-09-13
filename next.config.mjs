/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel 部署配置 - 支援 API 路由和動態功能
  // output: "export", // 註解掉這行以支援 API 路由
  trailingSlash: true,
  images: {
    unoptimized: true,
  },

  // 啟用壓縮
  compress: true,

  // 啟用實驗性功能
  experimental: {
    // 啟用 CSS 優化
    optimizeCss: true,
  },
};

export default nextConfig;
