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
  // 檢查多種可能的 Cloudflare 環境標識
  return (
    typeof globalThis !== "undefined" && (
      "Cloudflare" in globalThis ||
      (globalThis as any).env?.PRIMARY_ENGLISH_DB ||
      (globalThis as any).cloudflare?.env?.PRIMARY_ENGLISH_DB
    )
  );
}

// 獲取 Cloudflare 環境變數
export function getCloudflareEnv(): Partial<CloudflareEnv> {
  if (isCloudflareEnvironment()) {
    // 在 Cloudflare Workers 環境中
    return (globalThis as any).env || (globalThis as any).cloudflare?.env || {};
  }

  // 在 Node.js 環境中
  return {
    ENVIRONMENT: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
  };
}

// 獲取 D1 資料庫實例
export function getD1Database(): D1Database {
  console.log("Attempting to get D1 database...");
  
  // 嘗試多種方式獲取 D1 資料庫
  const possibleSources = [
    (globalThis as any).env?.PRIMARY_ENGLISH_DB,
    (globalThis as any).cloudflare?.env?.PRIMARY_ENGLISH_DB,
    (globalThis as any).PRIMARY_ENGLISH_DB,
  ];
  
  console.log("Possible D1 sources:", possibleSources.map(src => !!src));
  
  const d1Database = possibleSources.find(src => src);
  
  if (!d1Database) {
    console.log("D1 database not found in any source");
    
    // 在本地開發環境中，嘗試使用 wrangler 的本地 D1 連接
    if (process.env.NODE_ENV === "development") {
      console.log("Development environment detected, attempting local D1 connection...");
      // 這裡可以嘗試使用 wrangler 的本地 D1 功能
      throw new Error("D1_DATABASE_NOT_AVAILABLE_LOCAL");
    }

    throw new Error("D1 database not available in production environment");
  }

  console.log("D1 database found successfully");
  return d1Database;
}
