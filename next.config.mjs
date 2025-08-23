/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 支援
  output: "export",
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
