/**
 * @fileoverview EmailJS 客戶端工具 - 用於前端發送郵件
 */

// 動態導入 EmailJS，僅在客戶端環境中執行
let emailjsModule: any = null;

async function getEmailJS() {
  // 確保只在客戶端環境中執行
  if (typeof window === "undefined") {
    throw new Error("EmailJS 只能在客戶端環境中執行");
  }

  if (!emailjsModule) {
    try {
      // 使用動態導入，確保在客戶端環境中執行
      emailjsModule = await import("@emailjs/browser");
    } catch (error) {
      console.error("Failed to load EmailJS:", error);
      throw new Error("無法載入 EmailJS 模組");
    }
  }
  return emailjsModule;
}

// EmailJS 配置
export const EMAILJS_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "",
};

// 檢查是否在客戶端環境中
export function isClientSide(): boolean {
  return typeof window !== "undefined";
}

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
  // 檢查是否在客戶端環境中
  if (!isClientSide()) {
    return {
      success: false,
      error: "EmailJS 只能在客戶端環境中執行",
    };
  }

  if (!isEmailJSConfigured()) {
    return {
      success: false,
      error: "EmailJS 配置不完整，請檢查環境變數設定",
    };
  }

  try {
    // 使用動態載入的 EmailJS 模組
    const emailjs = await getEmailJS();

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
  // 檢查是否在客戶端環境中
  if (!isClientSide()) {
    return {
      success: false,
      error: "EmailJS 只能在客戶端環境中執行",
    };
  }

  if (!isEmailJSConfigured()) {
    return {
      success: false,
      error: "EmailJS 配置不完整，請檢查環境變數設定",
    };
  }

  try {
    // 使用動態載入的 EmailJS 模組
    const emailjs = await getEmailJS();

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
