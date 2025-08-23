// 專門處理 /games 路由的 Pages Function
export async function onRequest(context) {
  const { request, env, next } = context;

  // 直接轉發給 Next.js 處理
  return next();
}
