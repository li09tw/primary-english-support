"use client";

import { ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
}

// 簡化的 AuthGuard 組件，用於靜態網站
export default function AuthGuard({ children }: AuthGuardProps) {
  // 在靜態網站中，我們直接渲染子組件
  // 如果需要身份驗證，可以在這裡添加邏輯
  return <>{children}</>;
}
