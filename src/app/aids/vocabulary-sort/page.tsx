"use client";

import { useState, useEffect } from "react";
import { Vocabulary } from "@/types";
import { Word, WordTheme } from "@/types/learning-content";
import TextbookSelector from "@/components/TextbookSelector";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  useDraggable,
  useDroppable,
  closestCenter,
} from "@dnd-kit/core";

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

  return (
    <div
      ref={setNodeRef}
      className={`${
        category.color
      } border-2 border-gray-300 rounded-lg p-4 min-h-32 ${
        isOver ? "border-blue-500 bg-blue-200" : ""
      }`}
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

export default function VocabularySortPage() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<WordTheme[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [unassignedWords, setUnassignedWords] = useState<Vocabulary[]>([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [activeWord, setActiveWord] = useState<Vocabulary | null>(null);

  // 處理單字選擇
  const handleVocabularySelected = (words: Word[], themes: WordTheme[]) => {
    // 將 Word[] 轉換為 Vocabulary[] 格式
    const convertedVocabulary: Vocabulary[] = words.map((word) => ({
      id: word.id.toString(),
      english: word.english_singular,
      chinese: word.chinese_meaning,
      phonetic: "", // Word 類型沒有 phonetic 欄位，設為空字串
      example: "", // Word 類型沒有 example 欄位，設為空字串
      image: word.image_url,
    }));
    setVocabulary(convertedVocabulary);
    setSelectedThemes(themes);
  };

  // 開始詞彙分類遊戲
  const startVocabularySortGame = () => {
    if (vocabulary.length < 2) {
      alert("需要至少2個單字才能開始詞彙分類遊戲！");
      return;
    }

    if (selectedThemes.length !== 2) {
      alert("需要選擇2個主題才能開始遊戲！");
      return;
    }

    // 使用選擇的主題名稱作為分類名稱
    const colors = ["bg-blue-100", "bg-green-100"];

    const predefinedCategories: Category[] = selectedThemes.map(
      (theme, index) => ({
        id: `category${index + 1}`,
        name: theme.name,
        color: colors[index],
        words: [],
      })
    );

    // 將所有單字打散並放到未分類區域
    const shuffledWords = [...vocabulary].sort(() => Math.random() - 0.5);

    setCategories(predefinedCategories);
    setUnassignedWords(shuffledWords);
    setScore(0);
    setTotalWords(shuffledWords.length);
    setIsGameStarted(true);
    setIsGameComplete(false);
  };

  // 重置遊戲
  const resetGame = () => {
    if (vocabulary.length > 0 && selectedThemes.length === 2) {
      // 重新打散單字並重新開始遊戲
      const shuffledWords = [...vocabulary].sort(() => Math.random() - 0.5);
      const colors = ["bg-blue-100", "bg-green-100"];

      const predefinedCategories: Category[] = selectedThemes.map(
        (theme, index) => ({
          id: `category${index + 1}`,
          name: theme.name,
          color: colors[index],
          words: [],
        })
      );

      setCategories(predefinedCategories);
      setUnassignedWords(shuffledWords);
      setScore(0);
      setTotalWords(shuffledWords.length);
      setIsGameComplete(false);
    } else {
      // 如果沒有單字或主題，則完全重置
      setIsGameStarted(false);
      setCategories([]);
      setUnassignedWords([]);
      setScore(0);
      setTotalWords(0);
      setIsGameComplete(false);
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

  return (
    <div className="min-h-screen bg-primary-blue">
      <div className="pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 頁面標題 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">詞彙分類</h1>
            <p className="text-xl text-black">將單字按類別分類整理</p>
          </div>

          {/* 句型與單字主題選擇 */}
          {!isGameStarted && (
            <>
              <TextbookSelector
                onVocabularySelected={handleVocabularySelected}
              />

              {/* 開始遊戲按鈕 */}
              {vocabulary.length >= 2 && (
                <div className="text-center mb-8">
                  <button
                    onClick={startVocabularySortGame}
                    className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-lg"
                  >
                    開始詞彙分類遊戲
                  </button>
                </div>
              )}

              {vocabulary.length < 2 && vocabulary.length > 0 && (
                <div className="text-center text-red-600 text-sm mb-8">
                  需要至少2個單字才能開始詞彙分類遊戲，目前只有{" "}
                  {vocabulary.length} 個單字
                </div>
              )}
            </>
          )}

          {/* 詞彙分類遊戲區域 */}
          {isGameStarted && (
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
              onClick={() => window.history.back()}
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
