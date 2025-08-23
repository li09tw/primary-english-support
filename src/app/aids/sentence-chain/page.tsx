"use client";

import { useState, useEffect } from "react";
import { Vocabulary } from "@/types";
import TextbookSelector from "@/components/TextbookSelector";
import Link from "next/link";

interface Sentence {
  id: string;
  text: string;
  expectedWords: string[];
}

export default function SentenceChainPage() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [totalSentences, setTotalSentences] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [feedback, setFeedback] = useState("");

  // 處理單字選擇
  const handleVocabularySelected = (selectedVocabulary: Vocabulary[]) => {
    setVocabulary(selectedVocabulary);
  };

  // 開始短句接龍遊戲
  const startSentenceChainGame = () => {
    if (vocabulary.length < 10) {
      alert("需要至少10個單字才能開始短句接龍遊戲！");
      return;
    }

    // 生成句子
    const generatedSentences = generateSentences(vocabulary);
    setSentences(generatedSentences);
    setCurrentSentenceIndex(0);
    setUserInput("");
    setScore(0);
    setTotalSentences(generatedSentences.length);
    setFeedback("");
    setIsGameStarted(true);
  };

  // 生成句子
  const generateSentences = (vocab: Vocabulary[]): Sentence[] => {
    const sentences: Sentence[] = [];
    const shuffledVocab = [...vocab].sort(() => Math.random() - 0.5);

    // 簡單的句子生成邏輯
    for (let i = 0; i < Math.min(5, Math.floor(vocab.length / 2)); i++) {
      const startIndex = i * 2;
      const sentenceWords = shuffledVocab.slice(startIndex, startIndex + 2);
      
      if (sentenceWords.length === 2) {
        sentences.push({
          id: `sentence-${i}`,
          text: `I like to eat ${sentenceWords[0].english} and drink ${sentenceWords[1].english}.`,
          expectedWords: [sentenceWords[0].english, sentenceWords[1].english],
        });
      }
    }

    return sentences;
  };

  // 處理按鍵事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      submitSentence();
    }
  };

  // 提交句子
  const submitSentence = () => {
    if (!userInput.trim() || !sentences[currentSentenceIndex]) return;

    const currentSentence = sentences[currentSentenceIndex];
    const userWords = userInput.trim().toLowerCase().split(/\s+/);
    const expectedWords = currentSentence.expectedWords.map(word => word.toLowerCase());
    
    // 檢查是否包含預期的單字
    const containsExpectedWords = expectedWords.some(word => 
      userWords.some(userWord => userWord.includes(word) || word.includes(userWord))
    );

    if (containsExpectedWords) {
      setScore(score + 1);
      setFeedback("很好！你的句子包含了預期的單字。");
    } else {
      setFeedback("請嘗試在句子中使用預期的單字。");
    }

    // 延遲後進入下一題
    setTimeout(() => {
      if (currentSentenceIndex < sentences.length - 1) {
        setCurrentSentenceIndex(currentSentenceIndex + 1);
        setUserInput("");
        setFeedback("");
      } else {
        setIsGameStarted(false);
      }
    }, 2000);
  };

  // 重新開始遊戲
  const resetGame = () => {
    setIsGameStarted(false);
    setSentences([]);
    setCurrentSentenceIndex(0);
    setUserInput("");
    setScore(0);
    setTotalSentences(0);
    setFeedback("");
  };

  return (
    <div className="min-h-screen bg-primary-blue">
      <div className="pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 頁面標題 */}
            <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">短句接龍</h1>
            <p className="text-xl text-gray-600">輪流接龍，練習句型結構</p>
          </div>

          {/* 句型與單字主題選擇 */}
          {!isGameStarted && (
            <>
              <TextbookSelector onVocabularySelected={handleVocabularySelected} />

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
                  {vocabulary.length >= 10 && (
                    <button
                      onClick={startSentenceChainGame}
                      className="w-full mt-4 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                    >
                      開始短句接龍遊戲
                    </button>
                  )}

                  {vocabulary.length < 10 && vocabulary.length > 0 && (
                    <div className="text-center text-red-600 text-sm mt-4">
                      需要至少10個單字才能開始短句接龍遊戲，目前只有{" "}
                      {vocabulary.length} 個單字
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* 短句接龍遊戲區域 */}
          {isGameStarted && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  短句接龍遊戲進行中
                </h2>
                <button
                  onClick={resetGame}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  重新開始
                </button>
              </div>

              {/* 遊戲進度 */}
              <div className="mb-6 text-center">
                <div className="inline-flex items-center space-x-6">
                  <span className="text-gray-600">
                    進度: {currentSentenceIndex + 1} / {totalSentences}
                  </span>
                  <span className="text-gray-600">
                    得分: {score} / {totalSentences}
                  </span>
                </div>
              </div>

              {/* 當前句子 */}
              <div className="mb-8 text-center">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">
                    完成這個句子：
                  </h3>
                  <p className="text-2xl font-medium text-gray-800 mb-6">
                    {sentences[currentSentenceIndex]?.text}
                  </p>

                  {/* 輸入區域 */}
                  <div className="max-w-md mx-auto">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="輸入你的接龍句子..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
                    />
                  </div>

                  {/* 提交按鈕 */}
                  <button
                    onClick={submitSentence}
                    disabled={!userInput.trim()}
                    className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    提交句子
                  </button>
                </div>
              </div>

              {/* 反饋區域 */}
              {feedback && (
                <div className="mb-6 text-center">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-lg font-medium text-green-800">{feedback}</p>
                  </div>
                </div>
              )}

              {/* 遊戲提示 */}
              <div className="text-center text-gray-600 text-sm">
                <p>根據提示的句子，創建一個包含預期單字的新句子！</p>
              </div>
            </div>
          )}

          {/* 遊戲完成提示 */}
          {!isGameStarted && sentences.length > 0 && (
            <div className="text-center mt-8">
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg">
                🎉 遊戲完成！你的得分是 {score} / {totalSentences} 🎉
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
