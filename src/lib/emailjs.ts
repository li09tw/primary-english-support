// EmailJS REST API via server-side fetch
export const EMAILJS_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "",
};

async function emailjsSend(templateParams: Record<string, unknown>) {
  // EmailJS 的正確 API 端點和格式
  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: EMAILJS_CONFIG.serviceId,
      template_id: EMAILJS_CONFIG.templateId,
      user_id: EMAILJS_CONFIG.publicKey,
      template_params: templateParams,
    }),
  });

  console.log("EmailJS Request:", {
    service_id: EMAILJS_CONFIG.serviceId,
    template_id: EMAILJS_CONFIG.templateId,
    user_id: EMAILJS_CONFIG.publicKey,
    template_params: templateParams,
  });

  console.log("EmailJS Response Status:", response.status);

  if (!response.ok) {
    const text = await response.text();
    console.error("EmailJS Error:", text);
    throw new Error(`EmailJS REST failed: ${response.status} ${text}`);
  }

  const result = await response.text();
  console.log("EmailJS Success:", result);
  return result;
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
