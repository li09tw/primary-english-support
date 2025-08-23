// Minimal Cloudflare runtime type declarations for local Next.js type-checking
// These are intentionally lightweight and cover only the basics we might reference.

interface KVNamespace {
  get(
    key: string,
    options?: { type?: "text" | "json" | "arrayBuffer" }
  ): Promise<any>;
  put(
    key: string,
    value: string | ArrayBuffer | ReadableStream<any>,
    options?: {
      expiration?: number;
      expirationTtl?: number;
      metadata?: unknown;
    }
  ): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: {
    prefix?: string;
    limit?: number;
    cursor?: string;
  }): Promise<{
    keys: Array<{ name: string; expiration?: number; metadata?: unknown }>;
    list_complete: boolean;
    cursor?: string;
  }>;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  run<T = unknown>(): Promise<T>;
  all<T = unknown>(): Promise<{ results: T[] } | { success: boolean }>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  dump(): Promise<ArrayBuffer>;
}

interface R2Object {
  size: number;
  etag: string;
  httpEtag?: string;
  version?: string;
  uploaded: string | Date;
}

interface R2ObjectBody extends R2Object {
  body: ReadableStream<any> | null;
  bodyUsed: boolean;
  arrayBuffer(): Promise<ArrayBuffer>;
  text(): Promise<string>;
  json<T = unknown>(): Promise<T>;
}

interface R2ListOptions {
  prefix?: string;
  delimiter?: string;
  cursor?: string;
  startAfter?: string;
  limit?: number;
}

interface R2ListResult<T extends R2Object = R2Object> {
  objects: T[];
  delimitedPrefixes?: string[];
  truncated: boolean;
  cursor?: string;
}

interface R2Bucket {
  get(key: string): Promise<R2ObjectBody | null>;
  put(
    key: string,
    value: string | ArrayBuffer | ReadableStream<any> | Blob,
    options?: Record<string, unknown>
  ): Promise<R2Object | null>;
  delete(key: string | string[]): Promise<void>;
  head(key: string): Promise<R2Object | null>;
  list(options?: R2ListOptions): Promise<R2ListResult>;
}
