"use client";

import React, { useState, useEffect } from "react";
import { WordTheme, Word, Grade } from "@/types/learning-content";

interface TextbookSelectorProps {
  onVocabularySelected: (words: Word[], themes: WordTheme[]) => void;
}

export default function TextbookSelector({
  onVocabularySelected,
}: TextbookSelectorProps) {
  const [themes, setThemes] = useState<WordTheme[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<WordTheme[]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch themes on component mount
  useEffect(() => {
    fetchThemes();
  }, []);

  // Fetch words when selected themes change
  useEffect(() => {
    if (selectedThemes.length > 0) {
      fetchWordsByThemes(selectedThemes.map((theme) => theme.id));
    }
  }, [selectedThemes]);

  // Auto-select vocabulary when 2 themes are selected and words are loaded
  useEffect(() => {
    if (selectedThemes.length === 2 && words.length > 0) {
      onVocabularySelected(words, selectedThemes);
    }
  }, [selectedThemes, words, onVocabularySelected]);

  const fetchThemes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/learning-content?action=themes");
      const data = await response.json();

      if (data.success) {
        setThemes(data.data);
      } else {
        setError(data.error || "Failed to fetch themes");
      }
    } catch (err) {
      setError("Failed to fetch themes");
      console.error("Error fetching themes:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWordsByThemes = async (themeIds: number[]) => {
    try {
      setLoading(true);
      const allWords: Word[] = [];

      // 並行獲取所有主題的單字
      const promises = themeIds.map((themeId) =>
        fetch(
          `/api/learning-content?action=words_by_theme&theme_id=${themeId}`
        ).then((response) => response.json())
      );

      const results = await Promise.all(promises);

      // 合併所有單字
      results.forEach((result) => {
        if (result.success) {
          allWords.push(...result.data);
        }
      });

      // 去重複（基於單字ID）
      const uniqueWords = allWords.filter(
        (word, index, self) => index === self.findIndex((w) => w.id === word.id)
      );

      setWords(uniqueWords);
    } catch (err) {
      setError("Failed to fetch words");
      console.error("Error fetching words:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (theme: WordTheme) => {
    setSelectedThemes((prev) => {
      const isSelected = prev.some((t) => t.id === theme.id);
      if (isSelected) {
        // 如果已選擇，則移除
        return prev.filter((t) => t.id !== theme.id);
      } else if (prev.length < 2) {
        // 如果未選擇且未達到上限，則添加
        return [...prev, theme];
      } else {
        // 如果已達到上限，則替換第一個
        return [prev[1], theme];
      }
    });
  };

  if (loading && themes.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-red-800 text-sm">{error}</p>
        <button
          onClick={fetchThemes}
          className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Theme Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-black mb-2">
          單字主題 (請選擇2個主題)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {themes.map((theme) => {
            const isSelected = selectedThemes.some((t) => t.id === theme.id);
            const isDisabled = selectedThemes.length >= 2 && !isSelected;
            return (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme)}
                disabled={isDisabled}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : isDisabled
                    ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-black hover:bg-gray-200"
                }`}
              >
                {theme.name}
              </button>
            );
          })}
        </div>

        {/* 已選擇的主題顯示 */}
        {selectedThemes.length > 0 && (
          <div className="mt-3 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800 mb-2">
              已選擇的主題 ({selectedThemes.length}/2)
              {selectedThemes.length === 2 && words.length > 0
                ? `，共包含 ${words.length} 個單字`
                : ""}
              :
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedThemes.map((theme, index) => (
                <span
                  key={theme.id}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {theme.name}
                  <button
                    onClick={() => handleThemeChange(theme)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Auto-select vocabulary when 2 themes are selected */}
      {selectedThemes.length === 2 && words.length > 0 && (
        <div className="text-center">
          <div className="text-sm text-green-600 font-medium">
            ✓ 已準備好開始遊戲
          </div>
        </div>
      )}

      {/* Loading State for Words */}
      {selectedThemes.length > 0 && loading && (
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}
