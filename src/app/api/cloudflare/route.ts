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
        error: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}
