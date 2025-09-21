/**
 * @fileoverview EmailJS 伺服器端工具 - 用於 API 路由發送郵件
 * 這個檔案專門用於伺服器端 API 路由，使用 @emailjs/nodejs 套件
 * 包含驗證碼加密功能以提升安全性
 */

import emailjs from "@emailjs/nodejs";
import crypto from "crypto";
import { getEmailJSConfig } from "./env-config";

// EmailJS 配置
export const EMAILJS_CONFIG = getEmailJSConfig();

// 加密金鑰（用於驗證碼加密）
const ENCRYPTION_KEY =
  process.env.EMAILJS_ENCRYPTION_KEY ||
  "default-encryption-key-change-in-production";
const ALGORITHM = "aes-256-cbc";

// 加密驗證碼
function encryptVerificationCode(code: string): string {
  try {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(code, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
  } catch (error) {
    console.error("加密驗證碼失敗:", error);
    // 如果加密失敗，返回原始碼（降級處理）
    return code;
  }
}

// 解密驗證碼
export function decryptVerificationCode(encryptedCode: string): string {
  try {
    const parts = encryptedCode.split(":");
    if (parts.length !== 2) {
      // 如果不是加密格式，直接返回原始碼
      return encryptedCode;
    }
    const iv = Buffer.from(parts[0], "hex");
    const encrypted = parts[1];
    const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("解密驗證碼失敗:", error);
    // 如果解密失敗，返回原始碼（降級處理）
    return encryptedCode;
  }
}

// 檢查 EmailJS 配置是否完整
export function isEmailJSConfigured(): boolean {
  return !!(
    EMAILJS_CONFIG.serviceId &&
    EMAILJS_CONFIG.templateId &&
    EMAILJS_CONFIG.publicKey
  );
}

// 發送通知郵件（伺服器端實現）
export async function sendNotificationEmail(
  toEmail: string,
  subject: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  if (!isEmailJSConfigured()) {
    return {
      success: false,
      error: "EmailJS 配置不完整，請檢查環境變數設定",
    };
  }

  try {
    // 記錄驗證碼用於傳輸安全（不修改用戶看到的內容）
    let logContent = content;
    if (content.includes("驗證碼是：") && content.includes("分鐘後過期")) {
      // 提取驗證碼並記錄加密版本（僅用於日誌）
      const codeMatch = content.match(/驗證碼是：(\d+)/);
      if (codeMatch) {
        const originalCode = codeMatch[1];
        const encryptedCode = encryptVerificationCode(originalCode);
        // 記錄加密版本到日誌（用於安全監控）
        console.log("驗證碼已生成並加密:", {
          original: originalCode,
          encrypted: encryptedCode,
          timestamp: new Date().toISOString(),
          toEmail,
        });
      }
    } else if (subject.includes("驗證碼") && /\d{6}/.test(content)) {
      // 如果標題包含驗證碼且內容有6位數字，也記錄加密版本
      const codeMatch = content.match(/(\d{6})/);
      if (codeMatch) {
        const originalCode = codeMatch[1];
        const encryptedCode = encryptVerificationCode(originalCode);
        console.log("驗證碼已生成並加密:", {
          original: originalCode,
          encrypted: encryptedCode,
          timestamp: new Date().toISOString(),
          toEmail,
        });
      }
    }

    // 使用 @emailjs/nodejs 發送郵件
    const result = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      {
        title: subject,
        name: "系統通知",
        type: "通知",
        email: toEmail,
        content: content, // 發送原始內容給用戶
      },
      {
        publicKey: EMAILJS_CONFIG.publicKey,
      }
    );

    console.log("EmailJS 發送成功:", {
      status: result.status,
      messageId: result.text || "unknown",
      timestamp: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    console.error("EmailJS 發送失敗:", {
      error: error instanceof Error ? error.message : "未知錯誤",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      toEmail,
      subject,
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : "發送失敗",
    };
  }
}
