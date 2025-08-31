"use client";

import { useState, useEffect } from "react";
import { Vocabulary } from "@/types";
import { Word, WordTheme } from "@/types/learning-content";
import TextbookSelector from "@/components/TextbookSelector";
import Link from "next/link";

interface Card {
  id: string;
  word: string;
  chinese: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryMatchPage() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [moves, setMoves] = useState(0);

  // 處理單字選擇
  const handleVocabularySelected = (words: Word[], theme: WordTheme) => {
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
  };

  // 開始記憶配對遊戲
  const startMemoryGame = () => {
    if (vocabulary.length < 6) {
      alert("需要至少6個單字才能開始記憶配對遊戲！");
      return;
    }

    // 選擇單字數量（6-20個，必須是偶數）
    const maxWords = Math.min(vocabulary.length, 20);
    const wordCount = maxWords % 2 === 0 ? maxWords : maxWords - 1;

    // 隨機選擇單字
    const shuffled = [...vocabulary].sort(() => Math.random() - 0.5);
    const selectedWords = shuffled.slice(0, wordCount);

    // 建立配對卡片（每個單字兩張：英文和中文）
    const gameCards: Card[] = [];
    selectedWords.forEach((word, index) => {
      // 英文卡片
      gameCards.push({
        id: `en-${index}`,
        word: word.english,
        chinese: word.chinese,
        isFlipped: false,
        isMatched: false,
      });
      // 中文卡片
      gameCards.push({
        id: `zh-${index}`,
        word: word.english,
        chinese: word.chinese,
        isFlipped: false,
        isMatched: false,
      });
    });

    // 隨機排列卡片
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);

    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setIsGameStarted(true);
  };

  // 翻轉卡片
  const flipCard = (card: Card) => {
    if (card.isMatched || card.isFlipped || flippedCards.length >= 2) return;

    const newCards = cards.map((c) =>
      c.id === card.id ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, card];
    setFlippedCards(newFlippedCards);

    // 如果翻開了兩張卡片，檢查是否配對
    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1);

      if (newFlippedCards[0].word === newFlippedCards[1].word) {
        // 配對成功
        setTimeout(() => {
          const updatedCards = newCards.map((c) =>
            newFlippedCards.some((fc) => fc.id === c.id)
              ? { ...c, isMatched: true }
              : c
          );
          setCards(updatedCards);
          setFlippedCards([]);
        }, 500);
      } else {
        // 配對失敗，翻回卡片
        setTimeout(() => {
          const updatedCards = newCards.map((c) =>
            newFlippedCards.some((fc) => fc.id === c.id)
              ? { ...c, isFlipped: false }
              : c
          );
          setCards(updatedCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // 檢查遊戲是否完成
  const isGameComplete =
    cards.length > 0 && cards.every((card) => card.isMatched);

  // 重置遊戲
  const resetGame = () => {
    setIsGameStarted(false);
    setCards([]);
    setFlippedCards([]);
    setMoves(0);
  };

  return (
    <div className="min-h-screen bg-primary-blue">
      <div className="pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 頁面標題 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              中英文記憶配對
            </h1>
            <p className="text-xl text-gray-600">
              配對英文單字與中文意思，強化記憶
            </p>
          </div>

          {/* 句型與單字主題選擇 */}
          {!isGameStarted && (
            <>
              <TextbookSelector
                onVocabularySelected={handleVocabularySelected}
              />

              {/* 單字預覽 */}
              {vocabulary.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    單字列表 ({vocabulary.length} 個)
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md max-h-40 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {vocabulary.map((word) => (
                        <div key={word.id} className="text-sm text-gray-700">
                          {word.english} - {word.chinese}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 開始遊戲按鈕 */}
                  {vocabulary.length >= 6 && (
                    <button
                      onClick={startMemoryGame}
                      className="w-full mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                    >
                      開始記憶配對遊戲
                    </button>
                  )}

                  {vocabulary.length < 6 && vocabulary.length > 0 && (
                    <div className="text-center text-red-600 text-sm mt-4">
                      需要至少6個單字才能開始記憶配對遊戲，目前只有{" "}
                      {vocabulary.length} 個單字
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* 記憶配對遊戲區域 */}
          {isGameStarted && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  記憶配對遊戲進行中
                </h2>
                <button
                  onClick={resetGame}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  重新開始
                </button>
              </div>

              {/* 遊戲統計 */}
              <div className="mb-6 text-center">
                <div className="inline-flex items-center space-x-6">
                  <span className="text-gray-600">移動次數: {moves}</span>
                  <span className="text-gray-600">
                    配對成功: {cards.filter((c) => c.isMatched).length / 2}
                  </span>
                  <span className="text-gray-600">
                    總配對數: {cards.length / 2}
                  </span>
                </div>
              </div>

              {/* 遊戲完成提示 */}
              {isGameComplete && (
                <div className="mb-6 text-center">
                  <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg">
                    🎉 恭喜！遊戲完成！總共移動 {moves} 次 🎉
                  </div>
                </div>
              )}

              {/* 記憶卡片網格 */}
              <div className="mb-6">
                <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 max-w-4xl mx-auto">
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => flipCard(card)}
                      className={`
                        aspect-square border-2 rounded-lg flex items-center justify-center text-center p-2 cursor-pointer transition-all duration-300
                        ${
                          card.isMatched
                            ? "bg-green-100 border-green-500 text-green-800"
                            : card.isFlipped
                            ? "bg-blue-100 border-blue-500 text-blue-800"
                            : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200"
                        }
                      `}
                    >
                      {card.isFlipped || card.isMatched ? (
                        <div>
                          <div className="font-medium text-sm mb-1">
                            {card.id.startsWith("en")
                              ? card.word
                              : card.chinese}
                          </div>
                          <div className="text-xs text-gray-500">
                            {card.id.startsWith("en")
                              ? card.chinese
                              : card.word}
                          </div>
                        </div>
                      ) : (
                        <div className="text-2xl">❓</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 遊戲說明 */}
              <div className="text-center text-gray-600 text-sm">
                <p>點擊卡片進行配對，配對英文單字與中文意思</p>
              </div>
            </div>
          )}

          {/* 返回按鈕 */}
          <div className="text-center mt-8">
            <Link
              href="/aids"
              className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← 返回電子教具
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
