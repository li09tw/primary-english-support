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

async function emailjsSend(templateParams: Record<string, unknown>) {
  if (!isEmailJSConfigured()) {
    throw new Error("EmailJS 配置不完整，請檢查環境變數設定");
  }

  try {
    // 動態導入 EmailJS
    const emailjs = await import("@emailjs/browser");

    const result = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams,
      EMAILJS_CONFIG.publicKey
    );

    console.log("EmailJS 發送成功:", result);
    return result;
  } catch (error) {
    console.error("EmailJS 發送失敗:", error);
    throw error;
  }
}

// 發送聯絡表單郵件
export async function sendContactEmail(formData: {
  name: string;
  email: string;
  type: string;
  title: string;
  content: string;
}) {
  try {
    const data = await emailjsSend({
      title: formData.title,
      name: formData.name,
      type: formData.type,
      content: formData.content,
      from_email: formData.email,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error };
  }
}

// 發送通知郵件
export async function sendNotificationEmail(
  toEmail: string,
  subject: string,
  message: string
) {
  try {
    const data = await emailjsSend({
      to_email: toEmail,
      subject,
      message,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Notification email sending failed:", error);
    return { success: false, error };
  }
}
