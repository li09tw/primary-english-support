import emailjs from "@emailjs/browser";

// Email.js 配置
export const EMAILJS_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "",
};

// 發送聯絡表單郵件
export async function sendContactEmail(formData: {
  name: string;
  email: string;
  type: string;
  title: string;
  content: string;
}) {
  try {
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      {
        title: formData.title,
        name: formData.name,
        type: formData.type,
        content: formData.content,
        from_email: formData.email,
      },
      EMAILJS_CONFIG.publicKey
    );

    return { success: true, data: response };
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
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      {
        to_email: toEmail,
        subject,
        message,
      },
      EMAILJS_CONFIG.publicKey
    );

    return { success: true, data: response };
  } catch (error) {
    console.error("Notification email sending failed:", error);
    return { success: false, error };
  }
}
