"use client";

import React, { useState } from "react";
import {
  analyzePatternForThemes,
  testLunchPattern,
} from "@/lib/pattern-theme-mapping";
import { SentencePattern } from "@/types/learning-content";

export default function TestPatternMapping() {
  const [testResults, setTestResults] = useState<any>(null);
  const [customPattern, setCustomPattern] = useState(
    "Do you have lunch at _____?"
  );

  const runLunchTest = () => {
    try {
      const results = testLunchPattern();
      setTestResults({ type: "lunch", results });
    } catch (error) {
      setTestResults({
        type: "lunch",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  const testCustomPattern = () => {
    try {
      const testPattern: SentencePattern = {
        id: 999, // 臨時 ID 用於測試
        pattern_text: customPattern,
        grade_id: 3,
        pattern_type: "Question",
        notes: "Custom test pattern",
      };

      const results = analyzePatternForThemes(testPattern);
      setTestResults({ type: "custom", results, pattern: customPattern });
    } catch (error) {
      setTestResults({
        type: "custom",
        error: error instanceof Error ? error.message : String(error),
        pattern: customPattern,
      });
    }
  };

  const renderResults = () => {
    if (!testResults) return null;

    if (testResults.error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold text-red-800 mb-2">❌ 錯誤</h3>
          <p className="text-red-700">{testResults.error}</p>
        </div>
      );
    }

    if (testResults.type === "lunch") {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            🍽️ 午餐句型測試結果
          </h3>
          <div className="space-y-2">
            {testResults.results.map((rec: any, index: number) => (
              <div key={index} className="bg-white p-3 rounded border">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-black">
                    {rec.theme_name} (ID: {rec.theme_id})
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      rec.confidence > 0.8
                        ? "bg-green-100 text-green-800"
                        : rec.confidence > 0.6
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    信心度: {rec.confidence}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
              </div>
            ))}
          </div>

          {/* 檢查 BUILDINGS_PLACES 是否被找到 */}
          <div className="mt-4 p-3 bg-white rounded border">
            <h4 className="font-medium text-black mb-2">主題檢查結果:</h4>
            {testResults.results.find((r: any) => r.theme_id === 22) ? (
              <p className="text-green-700">
                ✅ BUILDINGS_PLACES (ID: 22) 已找到
              </p>
            ) : (
              <p className="text-red-700">
                ❌ BUILDINGS_PLACES (ID: 22) 未找到
              </p>
            )}
            {testResults.results.find((r: any) => r.theme_id === 24) ? (
              <p className="text-green-700">
                ✅ TIME_EXPRESSIONS (ID: 24) 已找到
              </p>
            ) : (
              <p className="text-red-700">
                ❌ TIME_EXPRESSIONS (ID: 24) 未找到
              </p>
            )}
          </div>
        </div>
      );
    }

    if (testResults.type === "custom") {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            🔍 自定義句型測試結果
          </h3>
          <p className="text-sm text-green-700 mb-3">
            句型: &quot;{testResults.pattern}&quot;
          </p>
          <div className="space-y-2">
            {testResults.results.map((rec: any, index: number) => (
              <div key={index} className="bg-white p-3 rounded border">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-black">
                    {rec.theme_name} (ID: {rec.theme_id})
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      rec.confidence > 0.8
                        ? "bg-green-100 text-green-800"
                        : rec.confidence > 0.6
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    信心度: {rec.confidence}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-black mb-6">
            句型主題映射測試工具
          </h1>

          <div className="space-y-6">
            {/* 午餐句型測試 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-black mb-3">
                🍽️ 測試午餐句型
              </h2>
              <p className="text-gray-600 mb-3">
                測試句型: &quot;Do you have lunch at _____?&quot; 的主題推薦
              </p>
              <button
                onClick={runLunchTest}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                運行午餐句型測試
              </button>
            </div>

            {/* 自定義句型測試 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-black mb-3">
                🔍 測試自定義句型
              </h2>
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="customPattern"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    輸入句型:
                  </label>
                  <input
                    type="text"
                    id="customPattern"
                    value={customPattern}
                    onChange={(e) => setCustomPattern(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="例如: Do you have lunch at _____?"
                  />
                </div>
                <button
                  onClick={testCustomPattern}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  測試自定義句型
                </button>
              </div>
            </div>

            {/* 測試結果 */}
            {renderResults()}

            {/* 說明 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                📋 測試說明
              </h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>
                  • 午餐句型測試會檢查 &quot;Do you have lunch at _____?&quot;
                  的主題推薦
                </li>
                <li>• 自定義句型測試可以輸入任何句型來測試主題推薦</li>
                <li>• 信心度越高，主題推薦越準確</li>
                <li>• 如果 BUILDINGS_PLACES 沒有出現，說明規則配置有問題</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
