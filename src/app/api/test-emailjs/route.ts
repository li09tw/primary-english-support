import { NextRequest, NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/emailjs-server";
import { getEmailJSConfig } from "@/lib/env-config";

export async function GET(request: NextRequest) {
  try {
    // 檢查環境變數
    const config = getEmailJSConfig();

    console.log("EmailJS Config:", {
      serviceId: config.serviceId ? "已設定" : "未設定",
      templateId: config.templateId ? "已設定" : "未設定",
      publicKey: config.publicKey ? "已設定" : "未設定",
    });

    // 檢查是否有任何配置缺失
    const missingConfigs = Object.entries(config)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingConfigs.length > 0) {
      return NextResponse.json({
        success: false,
        message: "EmailJS 配置不完整",
        missingConfigs,
        config: {
          serviceId: config.serviceId ? "已設定" : "未設定",
          templateId: config.templateId ? "已設定" : "未設定",
          publicKey: config.publicKey ? "已設定" : "未設定",
        },
      });
    }

    // 嘗試發送測試郵件
    const emailResult = await sendNotificationEmail(
      "test@example.com",
      "測試郵件",
      "這是一封測試郵件"
    );

    return NextResponse.json({
      success: emailResult.success,
      message: emailResult.success ? "EmailJS 配置正常" : "EmailJS 發送失敗",
      error: emailResult.success ? null : emailResult.error,
      config: {
        serviceId: config.serviceId ? "已設定" : "未設定",
        templateId: config.templateId ? "已設定" : "未設定",
        publicKey: config.publicKey ? "已設定" : "未設定",
      },
    });
  } catch (error) {
    console.error("EmailJS 測試失敗:", error);
    return NextResponse.json({
      success: false,
      message: "EmailJS 測試失敗",
      error: error instanceof Error ? error.message : "未知錯誤",
    });
  }
}
