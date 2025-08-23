// Pages Functions 路由處理器
// 這個文件會處理所有的 API 路由請求

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // 處理 API 路由
  if (url.pathname.startsWith("/api/")) {
    // 轉發到 Next.js API 路由
    return next();
  }

  // 處理靜態資源
  return next();
}
