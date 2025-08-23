// 本地開發環境的 Cloudflare 客戶端
// 用於在本地開發時與 Cloudflare Worker 互動

export interface LocalCloudflareClientConfig {
  workerUrl: string;
  apiSecret: string;
}

export class LocalCloudflareClient {
  private config: LocalCloudflareClientConfig;

  constructor(config: LocalCloudflareClientConfig) {
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

// 創建本地 Cloudflare 客戶端實例
export function createLocalCloudflareClient(): LocalCloudflareClient {
  // 本地開發環境配置
  const workerUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:8787"
      : process.env.CLOUDFLARE_WORKER_URL;

  const apiSecret =
    process.env.NODE_ENV === "development"
      ? "local-dev-secret"
      : process.env.CLOUDFLARE_API_SECRET;

  if (!workerUrl || !apiSecret) {
    throw new Error(
      "Missing Cloudflare environment variables: CLOUDFLARE_WORKER_URL or CLOUDFLARE_API_SECRET"
    );
  }

  return new LocalCloudflareClient({
    workerUrl,
    apiSecret,
  });
}

// 檢查是否在本地開發環境
export function isLocalDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

// 檢查本地 Cloudflare 客戶端是否可用
export function isLocalCloudflareAvailable(): boolean {
  return isLocalDevelopment() && !!process.env.CLOUDFLARE_WORKER_URL;
}
