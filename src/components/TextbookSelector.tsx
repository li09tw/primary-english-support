"use client";

import { useState, useEffect } from "react";
import { Textbook, Unit, Vocabulary } from "@/types";

interface TextbookSelectorProps {
  onVocabularySelected: (vocabulary: Vocabulary[]) => void;
  onSelectionChange?: (textbookId: string, unitIds: string[]) => void;
}

export default function TextbookSelector({
  onVocabularySelected,
  onSelectionChange,
}: TextbookSelectorProps) {
  const [textbooks, setTextbooks] = useState<Textbook[]>([]);
  const [selectedTextbooks, setSelectedTextbooks] = useState<Set<string>>(
    new Set()
  );
  const [selectedUnits, setSelectedUnits] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // 載入教材資料
  useEffect(() => {
    const loadTextbooks = () => {
      try {
        const saved = localStorage.getItem("textbooks");
        if (saved) {
          const parsed = JSON.parse(saved);
          setTextbooks(parsed);
        }
      } catch (error) {
        console.error("Error loading textbooks:", error);
      }
    };

    loadTextbooks();
  }, []);

  // 當選擇的教材或單元改變時，更新單字列表
  useEffect(() => {
    if (selectedTextbooks.size > 0 && selectedUnits.size > 0) {
      const allVocabulary: Vocabulary[] = [];

      selectedTextbooks.forEach((textbookId) => {
        const textbook = textbooks.find((t) => t.id === textbookId);
        if (textbook) {
          selectedUnits.forEach((unitId) => {
            const unit = textbook.units.find((u) => u.id === unitId);
            if (unit) {
              allVocabulary.push(...unit.vocabulary);
            }
          });
        }
      });

      onVocabularySelected(allVocabulary);

      if (onSelectionChange) {
        onSelectionChange(
          Array.from(selectedTextbooks)[0],
          Array.from(selectedUnits)
        );
      }
    } else {
      onVocabularySelected([]);
    }
  }, [
    selectedTextbooks,
    selectedUnits,
    textbooks,
    onVocabularySelected,
    onSelectionChange,
  ]);

  // 切換教材選擇
  const toggleTextbook = (textbookId: string) => {
    const newSelected = new Set(selectedTextbooks);
    if (newSelected.has(textbookId)) {
      newSelected.delete(textbookId);
      // 如果取消選擇教材，也要清除相關的單元選擇
      const textbook = textbooks.find((t) => t.id === textbookId);
      if (textbook) {
        const newSelectedUnits = new Set(selectedUnits);
        textbook.units.forEach((unit) => {
          newSelectedUnits.delete(unit.id);
        });
        setSelectedUnits(newSelectedUnits);
      }
    } else {
      newSelected.add(textbookId);
    }
    setSelectedTextbooks(newSelected);
  };

  // 切換單元選擇
  const toggleUnit = (unitId: string) => {
    const newSelected = new Set(selectedUnits);
    if (newSelected.has(unitId)) {
      newSelected.delete(unitId);
    } else {
      newSelected.add(unitId);
    }
    setSelectedUnits(newSelected);
  };

  // 檢查單元是否可選（只有選中的教材的單元才可選）
  const isUnitSelectable = (unitId: string) => {
    return Array.from(selectedTextbooks).some((textbookId) => {
      const textbook = textbooks.find((t) => t.id === textbookId);
      return textbook?.units.some((u) => u.id === unitId);
    });
  };

  // 獲取所有可選的單元
  const getAllUnits = () => {
    const allUnits: Unit[] = [];
    selectedTextbooks.forEach((textbookId) => {
      const textbook = textbooks.find((t) => t.id === textbookId);
      if (textbook) {
        allUnits.push(...textbook.units);
      }
    });
    return allUnits;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">句型與單字主題</h2>

      {/* 教材選擇 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          選擇教材
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {textbooks.map((textbook) => (
            <label
              key={textbook.id}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedTextbooks.has(textbook.id)}
                onChange={() => toggleTextbook(textbook.id)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-gray-700">
                {textbook.name} - {textbook.publisher} ({textbook.grade})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 單元選擇 */}
      {selectedTextbooks.size > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            選擇單元
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {getAllUnits().map((unit) => (
              <label
                key={unit.id}
                className={`flex items-center space-x-3 cursor-pointer ${
                  isUnitSelectable(unit.id)
                    ? ""
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedUnits.has(unit.id)}
                  onChange={() => toggleUnit(unit.id)}
                  disabled={!isUnitSelectable(unit.id)}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 disabled:opacity-50"
                />
                <span className="text-sm text-gray-700">{unit.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 選擇狀態提示 */}
      {selectedTextbooks.size > 0 && selectedUnits.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-blue-400 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-blue-800">
              已選擇 {selectedTextbooks.size} 個教材，{selectedUnits.size}{" "}
              個單元
            </span>
          </div>
        </div>
      )}

      {/* 沒有選擇的提示 */}
      {selectedTextbooks.size === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-gray-400 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-gray-600">
              請先選擇教材和單元以開始遊戲
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
