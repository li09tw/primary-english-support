/**
 * 環境變數配置
 * 統一處理本地開發和生產環境的環境變數
 */

export function getEmailJSConfig() {
  return {
    serviceId: process.env.EMAILJS_SERVICE_ID || "",
    templateId: process.env.EMAILJS_TEMPLATE_ID || "",
    publicKey: process.env.EMAILJS_PUBLIC_KEY || "",
  };
}
