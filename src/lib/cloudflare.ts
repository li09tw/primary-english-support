// Cloudflare 服務配置
// 這個文件在部署到 Cloudflare 時會被使用

export interface CloudflareConfig {
  // Cloudflare Workers 配置
  workers: {
    enabled: boolean;
    // 可以配置自定義的 Worker 函數
  };

  // Cloudflare KV 配置
  kv: {
    enabled: boolean;
    // 用於存儲用戶會話、快取等
  };

  // Cloudflare D1 配置
  d1: {
    enabled: boolean;
    // 用於存儲結構化資料
  };

  // Cloudflare R2 配置
  r2: {
    enabled: boolean;
    // 用於存儲文件、圖片等
  };
}

// 開發環境配置
export const cloudflareConfig: CloudflareConfig = {
  workers: {
    enabled: false, // 開發時使用 Next.js API Routes
  },
  kv: {
    enabled: false, // 開發時使用記憶體存儲
  },
  d1: {
    enabled: false, // 開發時使用記憶體存儲
  },
  r2: {
    enabled: false, // 使用本地存儲
  },
};

// 生產環境配置（部署到 Cloudflare 時）
export const productionCloudflareConfig: CloudflareConfig = {
  workers: {
    enabled: true,
  },
  kv: {
    enabled: true,
  },
  d1: {
    enabled: true,
  },
  r2: {
    enabled: true,
  },
};

// 獲取當前環境的配置
export function getCloudflareConfig(): CloudflareConfig {
  if (process.env.NODE_ENV === "production") {
    return productionCloudflareConfig;
  }
  return cloudflareConfig;
}

// Cloudflare Workers 環境變數類型
export interface CloudflareEnv {
  // KV 命名空間
  PRIMARY_ENGLISH_KV?: KVNamespace;

  // D1 資料庫
  PRIMARY_ENGLISH_DB?: D1Database;

  // R2 存儲
  PRIMARY_ENGLISH_R2?: R2Bucket;

  // 環境變數
  ENVIRONMENT?: string;
  JWT_SECRET?: string;
}

// 檢查是否在 Cloudflare 環境中運行
export function isCloudflareEnvironment(): boolean {
  return typeof globalThis !== "undefined" && "Cloudflare" in globalThis;
}

// 獲取 Cloudflare 環境變數
export function getCloudflareEnv(): Partial<CloudflareEnv> {
  if (isCloudflareEnvironment()) {
    // 在 Cloudflare Workers 環境中
    return (globalThis as any).env || {};
  }

  // 在 Node.js 環境中
  return {
    ENVIRONMENT: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
  };
}

// 獲取 D1 資料庫實例
export function getD1Database(): D1Database {
  // 嘗試訪問 Cloudflare 環境
  const cloudflareEnv = (globalThis as any).cloudflare?.env;
  const directEnv = (globalThis as any).env;
  const d1Database =
    cloudflareEnv?.PRIMARY_ENGLISH_DB || directEnv?.PRIMARY_ENGLISH_DB;

  if (!d1Database) {
    // 在本地開發環境中，嘗試使用 wrangler 的本地 D1 連接
    console.log("Attempting to connect to local D1 database...");

    // 檢查是否在本地開發環境
    if (process.env.NODE_ENV === "development") {
      // 在本地開發環境中，我們需要手動連接到 D1
      // 這裡可以嘗試使用 wrangler 的本地 D1 功能
      throw new Error("D1_DATABASE_NOT_AVAILABLE_LOCAL");
    }

    throw new Error("D1 database not available");
  }

  return d1Database;
}
