/**
 * @fileoverview 句型拉霸機主頁面 - 遊戲設定選擇器
 * @modified 2024-12-19 15:30 - 鎖定保護完成
 * @modified_by Assistant
 * @modification_type protection
 * @status locked
 * @last_commit 2024-12-19 15:30
 * @feature 句型拉霸機主頁面，包含年級、句型、主題選擇器
 * @protection 此檔案已鎖定，禁止修改，如需類似功能請建立新組件
 */

"use client";

import React, { useState } from "react";
import GameSetupSelector from "@/components/GameSetupSelector";
import { useRouter } from "next/navigation";
import { GameSetupData } from "@/types/learning-content";

export default function SentenceSlotPage() {
  const router = useRouter();

  const handleGameDataReady = (gameSetup: GameSetupData) => {
    // 構建遊戲頁面的 URL 參數
    const params = new URLSearchParams();
    params.append("grade", gameSetup.grade_id.toString());
    params.append("patterns", gameSetup.pattern_ids.join(","));
    params.append("themes", gameSetup.theme_ids.join(","));
    params.append("nounSelection", gameSetup.noun_selection);

    // 導向遊戲頁面
    router.push(`/aids/sentence-slot/game?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-primary-blue">
      <div className="pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 頁面標題 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">句型拉霸機</h1>
            <p className="text-xl text-black">
              選擇年級、句型和單字主題，開始練習句型！
            </p>
          </div>

          {/* 遊戲設定選擇器 */}
          <GameSetupSelector onGameDataReady={handleGameDataReady} />
        </div>
      </div>
    </div>
  );
}
