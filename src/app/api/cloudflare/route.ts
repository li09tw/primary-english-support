import { NextRequest, NextResponse } from "next/server";
import { createCloudflareClient } from "@/lib/cloudflare-client";

export async function POST(request: NextRequest) {
  try {
    const { action, query, params } = await request.json();

    if (!action || !query) {
      return NextResponse.json(
        { success: false, error: "Missing action or query" },
        { status: 400 }
      );
    }

    // 檢查環境變數
    console.log("Environment check:", {
      NODE_ENV: process.env.NODE_ENV,
      CLOUDFLARE_WORKER_URL: process.env.CLOUDFLARE_WORKER_URL
        ? "SET"
        : "NOT SET",
      CLOUDFLARE_API_SECRET: process.env.CLOUDFLARE_API_SECRET
        ? "SET"
        : "NOT SET",
    });

    const client = createCloudflareClient();

    let result;
    if (action === "query") {
      result = await client.query(query, params || []);
    } else if (action === "execute") {
      result = await client.execute(query, params || []);
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid action" },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Cloudflare API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
