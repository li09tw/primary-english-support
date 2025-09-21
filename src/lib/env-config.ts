/**
 * 環境變數配置
 * 統一處理本地開發和生產環境的環境變數
 */

export function getCloudflareConfig() {
  // 使用後端環境變數
  const workerUrl = process.env.CLOUDFLARE_WORKER_URL;
  const apiSecret = process.env.CLOUDFLARE_API_SECRET;

  if (!workerUrl || !apiSecret) {
    throw new Error(
      `Missing Cloudflare environment variables. Required:
      - CLOUDFLARE_WORKER_URL
      - CLOUDFLARE_API_SECRET
      
      Current values:
      - CLOUDFLARE_WORKER_URL: ${
        process.env.CLOUDFLARE_WORKER_URL ? "SET" : "NOT SET"
      }
      - CLOUDFLARE_API_SECRET: ${
        process.env.CLOUDFLARE_API_SECRET ? "SET" : "NOT SET"
      }
      
      Note: These are server-side environment variables
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
    serviceId: process.env.EMAILJS_SERVICE_ID || "",
    templateId: process.env.EMAILJS_TEMPLATE_ID || "",
    publicKey: process.env.EMAILJS_PUBLIC_KEY || "",
  };
}
