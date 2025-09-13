/**
 * 環境變數配置
 * 統一處理本地開發和生產環境的環境變數
 */

export function getCloudflareConfig() {
  // 統一使用 NEXT_PUBLIC_ 前綴的環境變數（Vercel 要求）
  const workerUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL;
  const apiSecret = process.env.NEXT_PUBLIC_CLOUDFLARE_API_SECRET;

  if (!workerUrl || !apiSecret) {
    throw new Error(
      `Missing Cloudflare environment variables. Required:
      - NEXT_PUBLIC_CLOUDFLARE_WORKER_URL
      - NEXT_PUBLIC_CLOUDFLARE_API_SECRET
      
      Current values:
      - NEXT_PUBLIC_CLOUDFLARE_WORKER_URL: ${
        process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL ? "SET" : "NOT SET"
      }
      - NEXT_PUBLIC_CLOUDFLARE_API_SECRET: ${
        process.env.NEXT_PUBLIC_CLOUDFLARE_API_SECRET ? "SET" : "NOT SET"
      }
      
      Note: In Vercel, all environment variables should use NEXT_PUBLIC_ prefix
      `
    );
  }

  return {
    workerUrl,
    apiSecret,
  };
}

export function getEmailJSConfig() {
  return {
    serviceId:
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ||
      process.env.EMAILJS_SERVICE_ID ||
      "",
    templateId:
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
      process.env.EMAILJS_TEMPLATE_ID ||
      "",
    publicKey:
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ||
      process.env.EMAILJS_PUBLIC_KEY ||
      "",
  };
}
