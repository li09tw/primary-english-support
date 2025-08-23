// Pages Functions 路由處理器
// 這個文件會處理所有的 API 路由請求

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // 處理 API 路由
  if (url.pathname.startsWith("/api/")) {
    // 對於 /api/games 路由，使用專門的處理器
    if (url.pathname === "/api/games") {
      // 轉發到專門的 games 處理器
      return next();
    }
    
    // 其他 API 路由轉發到 Next.js
    return next();
  }

  // 處理靜態資源
  return next();
}
