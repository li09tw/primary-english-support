/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 支援 - 移除靜態導出以支援 API 路由
  // output: "export", // 註解掉這行以支援 API 路由
  trailingSlash: true,
  images: {
    unoptimized: true,
  },

  // 啟用壓縮
  compress: true,

  // 啟用 SWC 壓縮
  swcMinify: true,

  // 啟用實驗性功能
  experimental: {
    // 啟用 CSS 優化
    optimizeCss: true,
  },
};

export default nextConfig;
