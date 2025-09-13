"use client";

import React, { useState, useEffect } from "react";
import { WordTheme, Word, Grade } from "@/types/learning-content";

interface TextbookSelectorProps {
  onVocabularySelected: (words: Word[], theme: WordTheme) => void;
}

export default function TextbookSelector({
  onVocabularySelected,
}: TextbookSelectorProps) {
  const [themes, setThemes] = useState<WordTheme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<WordTheme | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch themes on component mount
  useEffect(() => {
    fetchThemes();
  }, []);

  // Fetch words when theme changes
  useEffect(() => {
    if (selectedTheme) {
      fetchWordsByTheme(selectedTheme.id);
    }
  }, [selectedTheme]);

  const fetchThemes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/learning-content?action=themes");
      const data = await response.json();

      if (data.success) {
        setThemes(data.data);
        // Auto-select first theme
        if (data.data.length > 0) {
          setSelectedTheme(data.data[0]);
        }
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

  const fetchWordsByTheme = async (themeId: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/learning-content?action=words_by_theme&theme_id=${themeId}`
      );
      const data = await response.json();

      if (data.success) {
        setWords(data.data);
      } else {
        setError(data.error || "Failed to fetch words");
      }
    } catch (err) {
      setError("Failed to fetch words");
      console.error("Error fetching words:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (theme: WordTheme) => {
    setSelectedTheme(theme);
    setWords([]); // Clear words when theme changes
  };

  const handleVocabularySelect = () => {
    if (selectedTheme && words.length > 0) {
      onVocabularySelected(words, selectedTheme);
    }
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
          單字主題
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme)}
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                selectedTheme?.id === theme.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-black hover:bg-gray-200"
              }`}
            >
              {theme.name}
            </button>
          ))}
        </div>
      </div>

      {/* Word Count Display */}
      {selectedTheme && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <span className="font-medium">{selectedTheme.name}</span> 主題包含{" "}
            <span className="font-bold">{words.length}</span> 個單字
          </p>
        </div>
      )}

      {/* Action Button */}
      {selectedTheme && words.length > 0 && (
        <button
          onClick={handleVocabularySelect}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          開始學習 {selectedTheme.name}
        </button>
      )}

      {/* Loading State for Words */}
      {selectedTheme && loading && (
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}
