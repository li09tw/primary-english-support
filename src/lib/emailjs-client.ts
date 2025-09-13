/**
 * @fileoverview EmailJS 客戶端工具 - 用於前端發送郵件
 */

// EmailJS 配置
export const EMAILJS_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "",
};

// 檢查 EmailJS 配置是否完整
export function isEmailJSConfigured(): boolean {
  return !!(
    EMAILJS_CONFIG.serviceId &&
    EMAILJS_CONFIG.templateId &&
    EMAILJS_CONFIG.publicKey
  );
}

// 發送驗證碼郵件
export async function sendVerificationCodeEmail(
  toEmail: string,
  verificationCode: string,
  expiresIn: number
): Promise<{ success: boolean; error?: string }> {
  if (!isEmailJSConfigured()) {
    return {
      success: false,
      error: "EmailJS 配置不完整，請檢查環境變數設定",
    };
  }

  try {
    // 動態導入 EmailJS
    const emailjs = await import("@emailjs/browser");

    const templateParams = {
      title: "登入驗證碼",
      name: "登入機器人",
      type: "其他",
      email: "（免填）",
      content: verificationCode,
    };

    const result = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams,
      EMAILJS_CONFIG.publicKey
    );

    console.log("EmailJS 發送成功:", result);
    return { success: true };
  } catch (error) {
    console.error("EmailJS 發送失敗:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "發送失敗",
    };
  }
}

// 發送聯絡表單郵件
export async function sendContactEmail(formData: {
  name: string;
  email: string;
  type: string;
  title: string;
  content: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!isEmailJSConfigured()) {
    return {
      success: false,
      error: "EmailJS 配置不完整，請檢查環境變數設定",
    };
  }

  try {
    const emailjs = await import("@emailjs/browser");

    const templateParams = {
      title: formData.title,
      name: formData.name,
      type: formData.type,
      email: formData.email,
      content: formData.content,
    };

    const result = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams,
      EMAILJS_CONFIG.publicKey
    );

    console.log("EmailJS 聯絡表單發送成功:", result);
    return { success: true };
  } catch (error) {
    console.error("EmailJS 聯絡表單發送失敗:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "發送失敗",
    };
  }
}
