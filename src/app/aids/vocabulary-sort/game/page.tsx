"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Vocabulary } from "@/types";
import { WordTheme } from "@/types/learning-content";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  useDraggable,
  useDroppable,
  closestCenter,
} from "@dnd-kit/core";

// 添加CSS動畫樣式
const countdownAnimation = `
  @keyframes countdown {
    0% {
      background: conic-gradient(from 0deg, #ef4444 0deg, #ef4444 360deg, transparent 360deg);
    }
    25% {
      background: conic-gradient(from 0deg, #ef4444 0deg, #ef4444 270deg, transparent 270deg);
    }
    50% {
      background: conic-gradient(from 0deg, #ef4444 0deg, #ef4444 180deg, transparent 180deg);
    }
    75% {
      background: conic-gradient(from 0deg, #ef4444 0deg, #ef4444 90deg, transparent 90deg);
    }
    100% {
      background: conic-gradient(from 0deg, #ef4444 0deg, #ef4444 0deg, transparent 0deg);
    }
  }
  
  .countdown-ring {
    animation: countdown 2s linear forwards;
  }
`;

interface Category {
  id: string;
  name: string;
  color: string;
  words: Vocabulary[];
}

// 可拖拽的單字組件
function DraggableWord({ word }: { word: Vocabulary }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: word.id,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`bg-white border border-gray-300 rounded px-3 py-2 cursor-grab hover:bg-blue-50 hover:border-blue-300 transition-colors ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <span className="text-sm font-medium text-black">{word.english}</span>
      <span className="text-xs text-gray-500 ml-2">({word.chinese})</span>
    </div>
  );
}

// 電子白板模式的可點擊單字組件
function ClickableWord({
  word,
  isSelected,
  onToggle,
}: {
  word: Vocabulary;
  isSelected: boolean;
  onToggle: (word: Vocabulary) => void;
}) {
  return (
    <div
      onClick={() => onToggle(word)}
      className={`border-2 rounded px-3 py-2 cursor-pointer transition-all duration-200 ${
        isSelected
          ? "bg-blue-100 border-blue-500 shadow-md transform scale-105"
          : "bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400"
      }`}
    >
      <span className="text-sm font-medium text-black">{word.english}</span>
      <span className="text-xs text-gray-500 ml-2">({word.chinese})</span>
    </div>
  );
}

// 帶圓圈和讀秒條的單字組件
function WordWithCircles({
  word,
  categories,
  onCategorize,
  isActive,
  onActivate,
  onDeactivate,
}: {
  word: Vocabulary;
  categories: Category[];
  onCategorize: (word: Vocabulary, categoryId: string) => void;
  isActive: boolean;
  onActivate: (word: Vocabulary) => void;
  onDeactivate: (word: Vocabulary) => void;
}) {
  const [showCircles, setShowCircles] = useState(false);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  // 獲取圓圈顏色
  const getCircleColor = (category: Category) => {
    if (category.color === "bg-blue-100") {
      return "bg-blue-500";
    } else if (category.color === "bg-green-100") {
      return "bg-green-500";
    }
    return "bg-gray-500";
  };

  // 處理單字點擊
  const handleWordClick = () => {
    if (!isActive) {
      onActivate(word);
      setShowCircles(true);

      // 設置2秒計時器
      const timer = setTimeout(() => {
        setShowCircles(false);
        onDeactivate(word);
      }, 2000);

      setTimerId(timer);
    }
  };

  // 處理圓圈點擊
  const handleCircleClick = (categoryId: string) => {
    onCategorize(word, categoryId);
    setShowCircles(false);
    onDeactivate(word);

    // 清除計時器
    if (timerId) {
      clearTimeout(timerId);
      setTimerId(null);
    }
  };

  // 組件卸載時清除計時器
  useEffect(() => {
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [timerId]);

  // 當組件變為非活躍狀態時隱藏圓圈
  useEffect(() => {
    if (!isActive) {
      setShowCircles(false);
      if (timerId) {
        clearTimeout(timerId);
        setTimerId(null);
      }
    }
  }, [isActive, timerId]);

  return (
    <div className="relative inline-block">
      {/* 單字 */}
      <div
        onClick={handleWordClick}
        className={`border-2 rounded px-3 py-2 cursor-pointer transition-all duration-200 ${
          isActive
            ? "bg-blue-100 border-blue-500 shadow-md transform scale-105"
            : "bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400"
        }`}
      >
        <span className="text-sm font-medium text-black">{word.english}</span>
        <span className="text-xs text-gray-500 ml-2">({word.chinese})</span>
      </div>

      {/* 圓圈和讀秒條 */}
      {showCircles && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 flex space-x-2 z-10">
          {categories.map((category) => (
            <div key={category.id} className="relative">
              {/* 讀秒條外圈 */}
              <div className="relative w-12 h-12">
                {/* 讀秒條動畫 */}
                <div className="absolute inset-0 rounded-full countdown-ring" />

                {/* 圓圈 */}
                <div
                  onClick={() => handleCircleClick(category.id)}
                  className={`absolute inset-1 w-10 h-10 rounded-full ${getCircleColor(
                    category
                  )} cursor-pointer hover:scale-110 transition-transform duration-200 shadow-lg`}
                  title={`點擊分類到 ${category.name}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 可接收拖拽的分類區域組件
function DroppableCategory({
  category,
  onRemoveWord,
}: {
  category: Category;
  onRemoveWord: (word: Vocabulary, categoryId: string) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: category.id,
  });

  // 根據分類顏色設定拖曳時的加深效果
  const getDragOverStyles = () => {
    if (!isOver) return "";

    if (category.color === "bg-blue-100") {
      return "border-blue-500 bg-blue-200";
    } else if (category.color === "bg-green-100") {
      return "border-green-500 bg-green-200";
    }

    return "border-gray-500 bg-gray-200";
  };

  return (
    <div
      ref={setNodeRef}
      className={`${
        category.color
      } border-2 border-gray-300 rounded-lg p-4 min-h-32 ${getDragOverStyles()}`}
    >
      <h3 className="text-lg font-bold text-black mb-3">{category.name}</h3>
      <div className="min-h-20">
        <div className="flex flex-wrap gap-2">
          {category.words.map((word) => (
            <div
              key={word.id}
              className="bg-white border border-gray-300 rounded px-3 py-2 cursor-pointer hover:bg-red-50 hover:border-red-300 transition-colors"
              onClick={() => onRemoveWord(word, category.id)}
              title="點擊移除"
            >
              <span className="text-sm font-medium text-black">
                {word.english}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                ({word.chinese})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 電子白板模式的分類圓圈組件
function WhiteboardCategoryCircles({
  categories,
  selectedWords,
  onCategorize,
}: {
  categories: Category[];
  selectedWords: Vocabulary[];
  onCategorize: (categoryId: string) => void;
}) {
  const getCircleColor = (category: Category) => {
    if (category.color === "bg-blue-100") {
      return "bg-blue-500";
    } else if (category.color === "bg-green-100") {
      return "bg-green-500";
    }
    return "bg-gray-500";
  };

  return (
    <div className="flex justify-center space-x-8 mb-6">
      {categories.map((category) => (
        <div key={category.id} className="text-center">
          <div
            onClick={() => onCategorize(category.id)}
            className={`w-16 h-16 rounded-full ${getCircleColor(
              category
            )} cursor-pointer hover:scale-110 transition-transform duration-200 shadow-lg ${
              selectedWords.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-xl"
            }`}
            title={
              selectedWords.length === 0
                ? "請先選擇單字"
                : `點擊將選中的單字分類到 ${category.name}`
            }
          />
          <p className="text-sm font-medium text-black mt-2">{category.name}</p>
        </div>
      ))}
    </div>
  );
}

function VocabularySortGameContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<WordTheme[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [unassignedWords, setUnassignedWords] = useState<Vocabulary[]>([]);
  const [score, setScore] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [activeWord, setActiveWord] = useState<Vocabulary | null>(null);
  const [useWhiteboardMode, setUseWhiteboardMode] = useState(false);
  const [selectedWords, setSelectedWords] = useState<Vocabulary[]>([]);
  const [activeWords, setActiveWords] = useState<Set<string>>(new Set());

  // 初始化遊戲
  const initializeGame = useCallback(
    (vocab: Vocabulary[], themes: WordTheme[], shouldShuffle = true) => {
      if (vocab.length < 2 || themes.length !== 2) {
        alert("遊戲資料不完整！");
        router.push("/aids/vocabulary-sort");
        return;
      }

      // 使用選擇的主題名稱作為分類名稱
      const colors = ["bg-blue-100", "bg-green-100"];

      const predefinedCategories: Category[] = themes.map((theme, index) => ({
        id: `category${index + 1}`,
        name: theme.name,
        color: colors[index],
        words: [],
      }));

      // 只在需要時才打散單字
      const wordsToUse = shouldShuffle
        ? [...vocab].sort(() => Math.random() - 0.5)
        : [...vocab];

      setCategories(predefinedCategories);
      setUnassignedWords(wordsToUse);
      setScore(0);
      setTotalWords(wordsToUse.length);
      setIsGameComplete(false);
    },
    [router]
  );

  // 從 URL 參數載入遊戲資料
  useEffect(() => {
    const vocabularyData = searchParams.get("vocabulary");
    const themesData = searchParams.get("themes");
    const whiteboardData = searchParams.get("whiteboard");

    if (vocabularyData && themesData) {
      try {
        const parsedVocabulary = JSON.parse(vocabularyData);
        const parsedThemes = JSON.parse(themesData);
        const isWhiteboardMode = whiteboardData === "true";

        // 只在資料真正改變時才更新狀態
        setVocabulary((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(parsedVocabulary)) {
            return parsedVocabulary;
          }
          return prev;
        });

        setSelectedThemes((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(parsedThemes)) {
            return parsedThemes;
          }
          return prev;
        });

        setUseWhiteboardMode((prev) => {
          if (prev !== isWhiteboardMode) {
            return isWhiteboardMode;
          }
          return prev;
        });

        // 初始化遊戲（初次載入不打散）
        initializeGame(parsedVocabulary, parsedThemes, false);
      } catch (error) {
        console.error("Error parsing game data:", error);
        // 如果解析失敗，回到選擇頁面
        router.push("/aids/vocabulary-sort");
      }
    } else {
      // 如果沒有資料，回到選擇頁面
      router.push("/aids/vocabulary-sort");
    }
  }, [searchParams, router]);

  // 重置遊戲
  const resetGame = () => {
    if (vocabulary.length > 0 && selectedThemes.length === 2) {
      // 重置時打散單字
      initializeGame(vocabulary, selectedThemes, true);
      // 只在電子白板模式下清除選擇
      if (useWhiteboardMode) {
        setSelectedWords([]);
      }
    }
  };

  // 電子白板模式：選擇單字
  const toggleWordSelection = (word: Vocabulary) => {
    if (selectedWords.some((w) => w.id === word.id)) {
      // 取消選擇
      setSelectedWords((prev) => prev.filter((w) => w.id !== word.id));
    } else if (selectedWords.length < 3) {
      // 選擇單字（最多3個）
      setSelectedWords((prev) => [...prev, word]);
    }
  };

  // 電子白板模式：點擊圓圈分類
  const categorizeSelectedWords = (categoryId: string) => {
    if (selectedWords.length === 0) return;

    const updatedCategories = categories.map((category) => {
      if (category.id === categoryId) {
        return { ...category, words: [...category.words, ...selectedWords] };
      }
      return category;
    });

    const updatedUnassignedWords = unassignedWords.filter(
      (w) => !selectedWords.some((sw) => sw.id === w.id)
    );

    setCategories(updatedCategories);
    setUnassignedWords(updatedUnassignedWords);
    setScore((prev) => prev + selectedWords.length);
    setSelectedWords([]);

    // 檢查遊戲是否完成
    if (updatedUnassignedWords.length === 0) {
      setIsGameComplete(true);
    }
  };

  // 清除選擇
  const clearSelection = () => {
    setSelectedWords([]);
  };

  // 電子白板模式：激活單字（最多3個）
  const activateWord = (word: Vocabulary) => {
    setActiveWords((prev) => {
      const newActiveWords = new Set(prev);

      // 如果已經達到3個，移除最舊的
      if (newActiveWords.size >= 3) {
        const firstWord = Array.from(newActiveWords)[0];
        newActiveWords.delete(firstWord);
      }

      newActiveWords.add(word.id);
      return newActiveWords;
    });
  };

  // 電子白板模式：停用單字
  const deactivateWord = (word: Vocabulary) => {
    setActiveWords((prev) => {
      const newActiveWords = new Set(prev);
      newActiveWords.delete(word.id);
      return newActiveWords;
    });
  };

  // 電子白板模式：單字分類
  const categorizeWord = (word: Vocabulary, categoryId: string) => {
    // 檢查單字是否在未分類區域
    if (!unassignedWords.some((w) => w.id === word.id)) {
      return;
    }

    const updatedCategories = categories.map((category) => {
      if (category.id === categoryId) {
        return { ...category, words: [...category.words, word] };
      }
      return category;
    });

    const updatedUnassignedWords = unassignedWords.filter(
      (w) => w.id !== word.id
    );

    setCategories(updatedCategories);
    setUnassignedWords(updatedUnassignedWords);
    setScore((prev) => prev + 1);

    // 停用該單字
    deactivateWord(word);

    // 檢查遊戲是否完成
    if (updatedUnassignedWords.length === 0) {
      setIsGameComplete(true);
    }
  };

  // 拖拽單字到分類
  const dragWordToCategory = (word: Vocabulary, categoryId: string) => {
    // 檢查單字是否在未分類區域
    if (!unassignedWords.some((w) => w.id === word.id)) {
      return; // 如果單字不在未分類區域，則不執行任何操作
    }

    const updatedCategories = categories.map((category) => {
      if (category.id === categoryId) {
        return { ...category, words: [...category.words, word] };
      }
      return category;
    });

    const updatedUnassignedWords = unassignedWords.filter(
      (w) => w.id !== word.id
    );

    setCategories(updatedCategories);
    setUnassignedWords(updatedUnassignedWords);
    setScore((prev) => prev + 1);

    // 檢查遊戲是否完成
    if (updatedUnassignedWords.length === 0) {
      setIsGameComplete(true);
    }
  };

  // 從分類中移除單字
  const removeWordFromCategory = (word: Vocabulary, categoryId: string) => {
    const updatedCategories = categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          words: category.words.filter((w) => w.id !== word.id),
        };
      }
      return category;
    });

    setCategories(updatedCategories);
    setUnassignedWords((prev) => [...prev, word]);
    setScore((prev) => prev - 1);
    setIsGameComplete(false);
  };

  // 拖拽開始事件
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const word = unassignedWords.find((w) => w.id === active.id);
    if (word) {
      setActiveWord(word);
    }
  };

  // 拖拽結束事件
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveWord(null);

    if (!over) return;

    const word = unassignedWords.find((w) => w.id === active.id);
    if (!word) return;

    // 檢查是否拖拽到分類區域
    const category = categories.find((cat) => cat.id === over.id);
    if (category) {
      dragWordToCategory(word, category.id);
    }
  };

  // 回到選擇頁面
  const goBackToSelection = () => {
    router.push("/aids/vocabulary-sort");
  };

  return (
    <div className="min-h-screen bg-primary-blue">
      {/* 添加CSS動畫 */}
      <style dangerouslySetInnerHTML={{ __html: countdownAnimation }} />

      <div className="pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 頁面標題 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">詞彙分類遊戲</h1>
            <p className="text-xl text-black">將單字按類別分類整理</p>
          </div>

          {/* 詞彙分類遊戲區域 */}
          {useWhiteboardMode ? (
            // 電子白板模式
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">
                  詞彙分類遊戲進行中（電子白板模式）
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={resetGame}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    重新開始
                  </button>
                  <button
                    onClick={goBackToSelection}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    回到選擇
                  </button>
                </div>
              </div>

              {/* 遊戲統計 */}
              <div className="mb-6 text-center">
                <div className="inline-flex items-center space-x-6">
                  <span className="text-black">
                    已分類: {score} / {totalWords}
                  </span>
                  <span className="text-black">
                    未分類: {unassignedWords.length}
                  </span>
                  <span className="text-black">
                    已選擇: {selectedWords.length} / 3
                  </span>
                </div>
              </div>

              {/* 分類區域 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {categories.map((category) => (
                  <DroppableCategory
                    key={category.id}
                    category={category}
                    onRemoveWord={removeWordFromCategory}
                  />
                ))}
              </div>

              {/* 未分配單字區域 */}
              {unassignedWords.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-black mb-4">
                    未分類單字（點擊單字顯示圓圈，最多3個同時顯示）：
                  </h3>

                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="flex flex-wrap gap-2">
                      {unassignedWords.map((word) => (
                        <WordWithCircles
                          key={word.id}
                          word={word}
                          categories={categories}
                          onCategorize={categorizeWord}
                          isActive={activeWords.has(word.id)}
                          onActivate={activateWord}
                          onDeactivate={deactivateWord}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 遊戲完成提示 */}
              {isGameComplete && (
                <div className="mb-6 text-center">
                  <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg">
                    🎉 恭喜！所有單字都已正確分類！ 🎉
                  </div>
                </div>
              )}

              {/* 遊戲說明 */}
              <div className="text-center text-black text-sm">
                <p>
                  點擊單字顯示圓圈（最多3個同時顯示），2秒內點擊圓圈顏色進行分類，點擊已分類單字可移除重新分類
                </p>
              </div>
            </div>
          ) : (
            // 一般拖拽模式
            <DndContext
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-black">
                    詞彙分類遊戲進行中
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={resetGame}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      重新開始
                    </button>
                    <button
                      onClick={goBackToSelection}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      回到選擇
                    </button>
                  </div>
                </div>

                {/* 遊戲統計 */}
                <div className="mb-6 text-center">
                  <div className="inline-flex items-center space-x-6">
                    <span className="text-black">
                      已分類: {score} / {totalWords}
                    </span>
                    <span className="text-black">
                      未分類: {unassignedWords.length}
                    </span>
                  </div>
                </div>

                {/* 分類區域 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {categories.map((category) => (
                    <DroppableCategory
                      key={category.id}
                      category={category}
                      onRemoveWord={removeWordFromCategory}
                    />
                  ))}
                </div>

                {/* 未分配單字區域 */}
                {unassignedWords.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-black mb-4">
                      未分類單字（拖拽到上方分類區域）：
                    </h3>
                    <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <div className="flex flex-wrap gap-2">
                        {unassignedWords.map((word) => (
                          <DraggableWord key={word.id} word={word} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 遊戲完成提示 */}
                {isGameComplete && (
                  <div className="mb-6 text-center">
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg">
                      🎉 恭喜！所有單字都已正確分類！ 🎉
                    </div>
                  </div>
                )}

                {/* 遊戲說明 */}
                <div className="text-center text-black text-sm">
                  <p>
                    拖拽未分類單字到上方分類區域，點擊已分類單字可移除重新分類
                  </p>
                </div>
              </div>

              {/* 拖拽覆蓋層 */}
              <DragOverlay>
                {activeWord ? (
                  <div className="bg-white border border-gray-300 rounded px-3 py-2 shadow-lg">
                    <span className="text-sm font-medium text-black">
                      {activeWord.english}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({activeWord.chinese})
                    </span>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}

          {/* 返回按鈕 */}
          <div className="text-center mt-8">
            <button
              onClick={goBackToSelection}
              className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← 上一頁
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VocabularySortGamePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-primary-blue flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-xl text-black">載入中...</p>
          </div>
        </div>
      }
    >
      <VocabularySortGameContent />
    </Suspense>
  );
}
