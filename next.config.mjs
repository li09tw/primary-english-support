// ESM 環境不支援 __dirname，直接使用 process.cwd() 指向專案根
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

  // 明確指定輸出追蹤的根目錄，避免 Next.js 誤判到上層目錄的 lockfile
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
