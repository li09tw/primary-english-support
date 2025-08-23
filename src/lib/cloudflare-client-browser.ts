// 瀏覽器端的 Cloudflare 客戶端
// 通過 Next.js API 路由來與 Cloudflare 互動

export interface CloudflareClientConfig {
  apiBaseUrl: string;
}

export class CloudflareClientBrowser {
  private config: CloudflareClientConfig;

  constructor(config: CloudflareClientConfig) {
    this.config = config;
  }

  // 執行 D1 查詢
  async query(query: string, params: any[] = []): Promise<any> {
    const response = await fetch(`${this.config.apiBaseUrl}/api/cloudflare`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "query", query, params }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudflare API error: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  // 執行 D1 插入/更新/刪除
  async execute(query: string, params: any[] = []): Promise<any> {
    const response = await fetch(`${this.config.apiBaseUrl}/api/cloudflare`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "execute", query, params }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudflare API error: ${response.status} ${errorText}`);
    }

    return response.json();
  }
}

// 創建瀏覽器端 Cloudflare 客戶端實例
export function createCloudflareClientBrowser(): CloudflareClientBrowser {
  // 在瀏覽器中，我們使用相對路徑
  const apiBaseUrl = "";
  
  return new CloudflareClientBrowser({
    apiBaseUrl,
  });
}
