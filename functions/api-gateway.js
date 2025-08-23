// Cloudflare Worker API Gateway for Vercel
// 這個 Worker 作為 D1 和 R2 的 API 閘道

export default {
  async fetch(request, env, ctx) {
    // 0. 處理 CORS 預檢請求（必須在最前面）
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, X-API-Key, Authorization",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // 1. 安全性：檢查 API 密鑰
    const authKey = request.headers.get("X-API-Key");
    if (authKey !== env.API_SECRET) {
      return new Response("Unauthorized", {
        status: 401,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, X-API-Key, Authorization",
        },
      });
    }

    // 2. 路由：根據路徑決定操作
    const url = new URL(request.url);

    // 處理 D1 查詢
    if (url.pathname === "/query" && request.method === "POST") {
      try {
        const { query, params } = await request.json();
        console.log("🔍 D1 Query:", { query, params });

        const stmt = env.PRIMARY_ENGLISH_DB.prepare(query).bind(
          ...(params || [])
        );
        const data = await stmt.all();

        console.log("📊 D1 Response:", {
          success: true,
          results: data.results,
          meta: data.meta,
        });

        return new Response(
          JSON.stringify({
            success: true,
            results: data.results,
            meta: data.meta,
          }),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
              "Access-Control-Allow-Headers":
                "Content-Type, X-API-Key, Authorization",
            },
          }
        );
      } catch (e) {
        console.error("❌ D1 Query Error:", e);
        return new Response(
          JSON.stringify({
            success: false,
            error: e.message,
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
              "Access-Control-Allow-Headers":
                "Content-Type, X-API-Key, Authorization",
            },
          }
        );
      }
    }

    // 處理 D1 插入/更新/刪除
    if (url.pathname === "/execute" && request.method === "POST") {
      try {
        const { query, params } = await request.json();
        const stmt = env.PRIMARY_ENGLISH_DB.prepare(query).bind(
          ...(params || [])
        );
        const result = await stmt.run();
        return new Response(JSON.stringify(result), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers":
              "Content-Type, X-API-Key, Authorization",
          },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers":
              "Content-Type, X-API-Key, Authorization",
          },
        });
      }
    }

    // 處理 R2 操作 - 獲取物件
    if (url.pathname.startsWith("/storage/") && request.method === "GET") {
      const objectKey = url.pathname.replace("/storage/", "");
      const object = await env.primary_english_storage.get(objectKey);

      if (object === null) {
        return new Response("Object Not Found", { status: 404 });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);
      headers.set("Access-Control-Allow-Origin", "*");

      return new Response(object.body, { headers });
    }

    // 處理 R2 操作 - 上傳物件
    if (url.pathname.startsWith("/storage/") && request.method === "PUT") {
      const objectKey = url.pathname.replace("/storage/", "");
      const body = await request.arrayBuffer();

      try {
        await env.primary_english_storage.put(objectKey, body, {
          httpMetadata: {
            contentType:
              request.headers.get("content-type") || "application/octet-stream",
          },
        });

        return new Response(JSON.stringify({ success: true, key: objectKey }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers":
              "Content-Type, X-API-Key, Authorization",
          },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers":
              "Content-Type, X-API-Key, Authorization",
          },
        });
      }
    }

    // 處理 R2 操作 - 刪除物件
    if (url.pathname.startsWith("/storage/") && request.method === "DELETE") {
      const objectKey = url.pathname.replace("/storage/", "");

      try {
        await env.primary_english_storage.delete(objectKey);

        return new Response(JSON.stringify({ success: true, key: objectKey }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers":
              "Content-Type, X-API-Key, Authorization",
          },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers":
              "Content-Type, X-API-Key, Authorization",
          },
        });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
};
