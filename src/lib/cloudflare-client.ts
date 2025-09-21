// Cloudflare 服務客戶端
// 用於從 Vercel 呼叫 Cloudflare API 閘道

export interface CloudflareClientConfig {
  workerUrl: string;
  apiSecret: string;
}

export class CloudflareClient {
  private config: CloudflareClientConfig;

  constructor(config: CloudflareClientConfig) {
    this.config = config;
  }

  // 執行 D1 查詢
  async query(query: string, params: any[] = []): Promise<any> {
    const response = await fetch(`${this.config.workerUrl}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": this.config.apiSecret,
      },
      body: JSON.stringify({ query, params }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudflare API error: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  // 執行 D1 插入/更新/刪除
  async execute(query: string, params: any[] = []): Promise<any> {
    const response = await fetch(`${this.config.workerUrl}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": this.config.apiSecret,
      },
      body: JSON.stringify({ query, params }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudflare API error: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  // 從 R2 獲取物件
  async getObject(key: string): Promise<Response> {
    const response = await fetch(`${this.config.workerUrl}/storage/${key}`, {
      method: "GET",
      headers: {
        "X-API-Key": this.config.apiSecret,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudflare R2 error: ${response.status} ${errorText}`);
    }

    return response;
  }

  // 上傳物件到 R2
  async putObject(
    key: string,
    data: ArrayBuffer,
    contentType?: string
  ): Promise<any> {
    const headers: Record<string, string> = {
      "X-API-Key": this.config.apiSecret,
    };

    if (contentType) {
      headers["content-type"] = contentType;
    }

    const response = await fetch(`${this.config.workerUrl}/storage/${key}`, {
      method: "PUT",
      headers,
      body: data,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudflare R2 error: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  // 從 R2 刪除物件
  async deleteObject(key: string): Promise<any> {
    const response = await fetch(`${this.config.workerUrl}/storage/${key}`, {
      method: "DELETE",
      headers: {
        "X-API-Key": this.config.apiSecret,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudflare R2 error: ${response.status} ${errorText}`);
    }

    return response.json();
  }
}

// 創建 Cloudflare 客戶端實例
export function createCloudflareClient(): CloudflareClient {
  // 使用後端環境變數
  const workerUrl = process.env.CLOUDFLARE_WORKER_URL;
  const apiSecret = process.env.CLOUDFLARE_API_SECRET;

  console.log("Cloudflare client environment check:", {
    CLOUDFLARE_WORKER_URL: process.env.CLOUDFLARE_WORKER_URL
      ? "SET"
      : "NOT SET",
    CLOUDFLARE_API_SECRET: process.env.CLOUDFLARE_API_SECRET
      ? "SET"
      : "NOT SET",
    workerUrl: workerUrl ? "RESOLVED" : "NOT RESOLVED",
    apiSecret: apiSecret ? "RESOLVED" : "NOT RESOLVED",
  });

  if (!workerUrl || !apiSecret) {
    throw new Error(
      "Missing Cloudflare environment variables: CLOUDFLARE_WORKER_URL or CLOUDFLARE_API_SECRET"
    );
  }

  return new CloudflareClient({
    workerUrl,
    apiSecret,
  });
}

// 檢查是否在支援 Cloudflare 的環境中
export function isCloudflareSupported(): boolean {
  return !!(
    process.env.CLOUDFLARE_WORKER_URL && process.env.CLOUDFLARE_API_SECRET
  );
}
