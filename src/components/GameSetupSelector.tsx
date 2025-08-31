"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  GameData,
  Grade,
  SentencePattern,
  WordTheme,
  PluralFormOption,
  Word,
  GameSetupData,
} from "@/types/learning-content";
import {
  getRecommendedThemesForGrade,
  ThemeRecommendation,
} from "@/lib/pattern-theme-mapping";

interface GameSetupSelectorProps {
  onGameDataReady: (gameSetup: GameSetupData) => void;
}

export default function GameSetupSelector({
  onGameDataReady,
}: GameSetupSelectorProps) {
  // State variables
  const [grades, setGrades] = useState<Grade[]>([]);
  const [sentencePatterns, setSentencePatterns] = useState<SentencePattern[]>(
    []
  );
  const [themes, setThemes] = useState<WordTheme[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedPatternIds, setSelectedPatternIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [words, setWords] = useState<Word[]>([]);
  const [recommendedThemes, setRecommendedThemes] = useState<
    ThemeRecommendation[]
  >([]);

  // Core Logic & State Management
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [nounSelection, setNounSelection] = useState<
    "singular" | "plural" | "both"
  >("both");

  // Define topics to be excluded from noun calculations
  const nounCalculationExclusions = ["Daily Actions", "Emotions", "Numbers"];

  // Mock wordThemeMap for local development
  const wordThemeMap = React.useMemo(
    () =>
      new Map<number, number[]>([
        // Emotions (theme_id: 1) - words 1-8
        [1, [1]],
        [2, [1]],
        [3, [1]],
        [4, [1]],
        [5, [1]],
        [6, [1]],
        [7, [1]],
        [8, [1]],
        // Colors (theme_id: 2) - words 9-19
        [9, [2]],
        [10, [2]],
        [11, [2]],
        [12, [2]],
        [13, [2]],
        [14, [2]],
        [15, [2]],
        [16, [2]],
        [17, [2]],
        [18, [2]],
        [19, [2]],
        // Sports (theme_id: 3) - words 20-27
        [20, [3]],
        [21, [3]],
        [22, [3]],
        [23, [3]],
        [24, [3]],
        [25, [3]],
        [26, [3]],
        [27, [3]],
        // Stationery (theme_id: 4) - words 28-34
        [28, [4]],
        [29, [4]],
        [30, [4]],
        [31, [4]],
        [32, [4]],
        [33, [4]],
        [34, [4]],
        // Fruits (theme_id: 5) - words 35-41
        [35, [5]],
        [36, [5]],
        [37, [5]],
        [38, [5]],
        [39, [5]],
        [40, [5]],
        [41, [5]],
        // Fast Food (theme_id: 6) - words 54-59
        [54, [6]],
        [55, [6]],
        [56, [6]],
        [57, [6]],
        [58, [6]],
        [59, [6]],
        // Bakery & Snacks (theme_id: 7) - words 60-66
        [60, [7]],
        [61, [7]],
        [62, [7]],
        [63, [7]],
        [64, [7]],
        [65, [7]],
        [66, [7]],
        // Days of the Week (theme_id: 8) - words 54-60
        [54, [8]],
        [55, [8]],
        [56, [8]],
        [57, [8]],
        [58, [8]],
        [59, [8]],
        [60, [8]],
        // Months (theme_id: 9) - words 61-72
        [61, [9]],
        [62, [9]],
        [63, [9]],
        [64, [9]],
        [65, [9]],
        [66, [9]],
        [67, [9]],
        [68, [9]],
        [69, [9]],
        [70, [9]],
        [71, [9]],
        [72, [9]],
        // School Subjects (theme_id: 10) - words 73-80
        [73, [10]],
        [74, [10]],
        [75, [10]],
        [76, [10]],
        [77, [10]],
        [78, [10]],
        [79, [10]],
        [80, [10]],
        // Ailments (theme_id: 11) - words 81-85
        [81, [11]],
        [82, [11]],
        [83, [11]],
        [84, [11]],
        [85, [11]],
        // Countries (theme_id: 12) - words 86-95
        [86, [12]],
        [87, [12]],
        [88, [12]],
        [89, [12]],
        [90, [12]],
        [91, [12]],
        [92, [12]],
        [93, [12]],
        [94, [12]],
        [95, [12]],
        // Furniture (theme_id: 13) - words 96-105
        [96, [13]],
        [97, [13]],
        [98, [13]],
        [99, [13]],
        [100, [13]],
        [101, [13]],
        [102, [13]],
        [103, [13]],
        [104, [13]],
        [105, [13]],
        // Toys (theme_id: 14) - words 106-115
        [106, [14]],
        [107, [14]],
        [108, [14]],
        [109, [14]],
        [110, [14]],
        [111, [14]],
        [112, [14]],
        [113, [14]],
        [114, [14]],
        [115, [14]],
        // Drinks (theme_id: 15) - words 116-125
        [116, [15]],
        [117, [15]],
        [118, [15]],
        [119, [15]],
        [120, [15]],
        [121, [15]],
        [122, [15]],
        [123, [15]],
        [124, [15]],
        [125, [15]],
        // Main Dishes (theme_id: 16) - words 126-135
        [126, [16]],
        [127, [16]],
        [128, [16]],
        [129, [16]],
        [130, [16]],
        [131, [16]],
        [132, [16]],
        [133, [16]],
        [134, [16]],
        [135, [16]],
        // Bubble Tea Toppings (theme_id: 17) - words 136-145
        [136, [17]],
        [137, [17]],
        [138, [17]],
        [139, [17]],
        [140, [17]],
        [141, [17]],
        [142, [17]],
        [143, [17]],
        [144, [17]],
        [145, [17]],
        // Identity (theme_id: 18) - words 146-155
        [146, [18]],
        [147, [18]],
        [148, [18]],
        [149, [18]],
        [150, [18]],
        [151, [18]],
        [152, [18]],
        [153, [18]],
        [154, [18]],
        [155, [18]],
        // Professions (theme_id: 19) - words 156-165
        [156, [19]],
        [157, [19]],
        [158, [19]],
        [159, [19]],
        [160, [19]],
        [161, [19]],
        [162, [19]],
        [163, [19]],
        [164, [19]],
        [165, [19]],
        // Daily Actions (theme_id: 20) - words 166-175
        [166, [20]],
        [167, [20]],
        [168, [20]],
        [169, [20]],
        [170, [20]],
        [171, [20]],
        [172, [20]],
        [173, [20]],
        [174, [20]],
        [175, [20]],
        // Clothing (theme_id: 21) - words 176-185
        [176, [21]],
        [177, [21]],
        [178, [21]],
        [179, [21]],
        [180, [21]],
        [181, [21]],
        [182, [21]],
        [183, [21]],
        [184, [21]],
        [185, [21]],
        // Buildings & Places (theme_id: 22) - words 186-195
        [186, [22]],
        [187, [22]],
        [188, [22]],
        [189, [22]],
        [190, [22]],
        [191, [22]],
        [192, [22]],
        [193, [22]],
        [194, [22]],
        [195, [22]],
        // Numbers (theme_id: 23) - words 90-119 (1-30)
        [90, [23]],
        [91, [23]],
        [92, [23]],
        [93, [23]],
        [94, [23]],
        [95, [23]],
        [96, [23]],
        [97, [23]],
        [98, [23]],
        [99, [23]],
        [100, [23]],
        [101, [23]],
        [102, [23]],
        [103, [23]],
        [104, [23]],
        [105, [23]],
        [106, [23]],
        [107, [23]],
        [108, [23]],
        [109, [23]],
        [110, [23]],
        [111, [23]],
        [112, [23]],
        [113, [23]],
        [114, [23]],
        [115, [23]],
        [116, [23]],
        [117, [23]],
        [118, [23]],
        [119, [23]],
        // Time Expressions (theme_id: 24) - words 321-380
        [321, [24]],
        [322, [24]],
        [323, [24]],
        [324, [24]],
        [325, [24]],
        [326, [24]],
        [327, [24]],
        [328, [24]],
        [329, [24]],
        [330, [24]],
        [331, [24]],
        [332, [24]],
        [333, [24]],
        [334, [24]],
        [335, [24]],
        [336, [24]],
        [337, [24]],
        [338, [24]],
        [339, [24]],
        [340, [24]],
        [341, [24]],
        [342, [24]],
        [343, [24]],
        [344, [24]],
        [345, [24]],
        [346, [24]],
        [347, [24]],
        [348, [24]],
        [349, [24]],
        [350, [24]],
        [351, [24]],
        [352, [24]],
        [353, [24]],
        [354, [24]],
        [355, [24]],
        [356, [24]],
        [357, [24]],
        [358, [24]],
        [359, [24]],
        [360, [24]],
        [361, [24]],
        [362, [24]],
        [363, [24]],
        [364, [24]],
        [365, [24]],
        [366, [24]],
        [367, [24]],
        [368, [24]],
        [369, [24]],
        [370, [24]],
        [371, [24]],
        [372, [24]],
        [373, [24]],
        [374, [24]],
        [375, [24]],
        [376, [24]],
        [377, [24]],
        [378, [24]],
        [379, [24]],
        [380, [24]],
      ]),
    []
  );

  // 使用 useCallback 來穩定函數引用
  const fetchGrades = useCallback(async () => {
    try {
      const response = await fetch("/api/learning-content?action=grades");
      const data = await response.json();
      if (data.success) {
        setGrades(data.data);
      }
    } catch (error) {
      console.error("Error fetching grades:", error);
    }
  }, []);

  const fetchThemes = useCallback(async () => {
    try {
      console.log("🎯 Fetching themes..."); // Debug log
      const response = await fetch("/api/learning-content?action=themes");
      const data = await response.json();
      console.log("📡 API response:", data); // Debug log

      if (data.success) {
        // 直接使用 API 返回的主題資料，不需要手動添加
        setThemes(data.data);
        console.log("✅ setThemes called with:", data.data.length, "themes"); // Debug log

        // 驗證狀態是否更新
        setTimeout(() => {
          console.log("🔍 Current themes state:", themes); // Debug log
        }, 100);
      }
    } catch (error) {
      console.error("❌ Error fetching themes:", error);
    }
  }, []);

  const fetchSentencePatterns = useCallback(async (gradeId: number) => {
    try {
      const response = await fetch(
        `/api/learning-content?action=sentence_patterns&grade_id=${gradeId}`
      );
      const data = await response.json();
      if (data.success) {
        setSentencePatterns(data.data);
        setSelectedPatternIds([]); // Reset pattern selection
      }
    } catch (error) {
      console.error("Error fetching sentence patterns:", error);
    }
  }, []);

  // 使用 useRef 追蹤數字單字是否已生成
  const numbersGeneratedRef = useRef(false);
  const baseWordsRef = useRef<Word[]>([]);

  // 初始化基礎單字參考
  useEffect(() => {
    if (words.length > 0 && baseWordsRef.current.length === 0) {
      baseWordsRef.current = [...words];
    }
  }, [words]);

  const fetchWordsByThemes = useCallback(
    async (topicNames: string[]) => {
      try {
        console.log("🎯 Fetching words for topics:", topicNames); // Debug log

        // 檢查是否包含數字主題
        const hasNumbersTheme = topicNames.includes("Numbers");
        console.log("🔢 Has Numbers theme:", hasNumbersTheme); // Debug log

        if (hasNumbersTheme) {
          // 數字主題的單字由 game-data API 的 mock 資料提供
          // 不需要在這裡生成數字單字
          console.log("🔢 Numbers theme selected - using mock data from API");

          // 直接使用從 API 獲取的單字（包含數字單字）
          setWords(words);
        } else {
          // 不包含數字主題時，使用基礎單字
          const filteredWords = baseWordsRef.current.filter((word: Word) => {
            const wordThemes = wordThemeMap.get(word.id);
            if (!wordThemes) return false;

            return wordThemes.some((themeId) => {
              const theme = themes.find((t) => t.id === themeId);
              return theme && topicNames.includes(theme.name);
            });
          });
          setWords(filteredWords);
        }
      } catch (error) {
        console.error("❌ Error fetching words by themes:", error);
      }
    },
    [themes, wordThemeMap] // 移除 words 依賴項，避免無限迴圈
  );

  // 修復 useEffect 依賴項
  useEffect(() => {
    fetchGrades();
    fetchThemes();
  }, []); // 移除依賴項，避免無限迴圈

  // Fetch words when selected themes change
  useEffect(() => {
    if (selectedTopics.length > 0) {
      fetchWordsByThemes(selectedTopics);
    } else {
      setWords([]);
    }
  }, [selectedTopics, fetchWordsByThemes]);

  // Handle pattern selection and theme recommendations
  useEffect(() => {
    if (selectedPatternIds.length > 0 && sentencePatterns.length > 0) {
      const selectedPatterns = sentencePatterns.filter((pattern) =>
        selectedPatternIds.includes(pattern.id)
      );

      if (selectedPatterns.length > 0) {
        const recommendations = getRecommendedThemesForGrade(
          selectedGrade || 1,
          selectedPatterns
        );

        setRecommendedThemes(recommendations);
        // 移除自動勾選邏輯，改為建議而非強制
      }
    } else {
      // 當沒有選擇句型時，清空推薦主題
      setRecommendedThemes([]);
    }
  }, [selectedPatternIds, sentencePatterns, selectedGrade, themes]);

  // Handle grade change
  useEffect(() => {
    if (selectedGrade) {
      fetchSentencePatterns(selectedGrade);
    } else {
      setSentencePatterns([]);
      setSelectedPatternIds([]);
      setRecommendedThemes([]);
    }
  }, [selectedGrade, fetchSentencePatterns]);

  // New functions for select all/deselect all themes
  const handleSelectAllThemes = () => {
    const allTopicNames = themes.map((theme) => theme.name);
    setSelectedTopics(allTopicNames);
  };

  const handleDeselectAllThemes = () => {
    setSelectedTopics([]);
  };

  // Calculate word counts based on the new logic
  const calculateWordCounts = () => {
    if (words.length === 0 || selectedTopics.length === 0) {
      return {
        singularCount: 0,
        pluralCount: 0,
        bothCount: 0,
        uncountableCount: 0,
      };
    }

    // Filter words that are in selected topics
    const filteredWords = words.filter((word) => {
      // 特殊處理數字主題
      if (
        selectedTopics.includes("Numbers") &&
        word.id >= 221 &&
        word.id <= 320
      ) {
        return true;
      }

      const wordThemes = wordThemeMap.get(word.id);
      if (!wordThemes) return false;

      return wordThemes.some((themeId) => {
        const theme = themes.find((t) => t.id === themeId);
        return theme && selectedTopics.includes(theme.name);
      });
    });

    // Separate words by type
    const excludedWords = filteredWords.filter((word) => {
      // 特殊處理數字主題
      if (
        selectedTopics.includes("Numbers") &&
        word.id >= 221 &&
        word.id <= 320
      ) {
        return true; // 數字主題的單字應該被排除
      }

      const wordThemes = wordThemeMap.get(word.id);
      if (!wordThemes) return false;

      return wordThemes.some((themeId) => {
        const theme = themes.find((t) => t.id === themeId);
        return theme && nounCalculationExclusions.includes(theme.name);
      });
    });

    const uncountableNouns = filteredWords.filter(
      (word) => word.part_of_speech === "noun" && word.has_plural === false
    );

    const countableNouns = filteredWords.filter(
      (word) => word.part_of_speech === "noun" && word.has_plural === true
    );

    // Calculate counts
    const singularCount = countableNouns.length;
    const pluralCount = countableNouns.filter(
      (word) => word.english_plural
    ).length;
    const bothCount = singularCount + pluralCount;
    const uncountableCount = uncountableNouns.length;

    return {
      singularCount,
      pluralCount,
      bothCount,
      uncountableCount,
    };
  };

  // Get word count for a specific theme
  const getWordCountForTheme = (themeName: string) => {
    if (words.length === 0) return 0;

    // 特殊處理數字主題
    if (themeName === "Numbers") {
      return 100; // 數字主題固定有 100 個單字
    }

    return words.filter((word) => {
      const wordThemes = wordThemeMap.get(word.id);
      if (!wordThemes) return false;

      return wordThemes.some((themeId) => {
        const theme = themes.find((t) => t.id === themeId);
        return theme && theme.name === themeName;
      });
    }).length;
  };

  // 添加數字轉換函數
  const getNumberWord = (num: number): string => {
    const numbers = [
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
      "twenty",
      "twenty-one",
      "twenty-two",
      "twenty-three",
      "twenty-four",
      "twenty-five",
      "twenty-six",
      "twenty-seven",
      "twenty-eight",
      "twenty-nine",
      "thirty",
      "thirty-one",
      "thirty-two",
      "thirty-three",
      "thirty-four",
      "thirty-five",
      "thirty-six",
      "thirty-seven",
      "thirty-eight",
      "thirty-nine",
      "forty",
      "forty-one",
      "forty-two",
      "forty-three",
      "forty-four",
      "forty-five",
      "forty-six",
      "forty-seven",
      "forty-eight",
      "forty-nine",
      "fifty",
      "fifty-one",
      "fifty-two",
      "fifty-three",
      "fifty-four",
      "fifty-five",
      "fifty-six",
      "fifty-seven",
      "fifty-eight",
      "fifty-nine",
      "sixty",
      "sixty-one",
      "sixty-two",
      "sixty-three",
      "sixty-four",
      "sixty-five",
      "sixty-six",
      "sixty-seven",
      "sixty-eight",
      "sixty-nine",
      "seventy",
      "seventy-one",
      "seventy-two",
      "seventy-three",
      "seventy-four",
      "seventy-five",
      "seventy-six",
      "seventy-seven",
      "seventy-eight",
      "seventy-nine",
      "eighty",
      "eighty-one",
      "eighty-two",
      "eighty-three",
      "eighty-four",
      "eighty-five",
      "eighty-six",
      "eighty-seven",
      "eighty-eight",
      "eighty-nine",
      "ninety",
      "ninety-one",
      "ninety-two",
      "ninety-three",
      "ninety-four",
      "ninety-five",
      "ninety-six",
      "ninety-seven",
      "ninety-eight",
      "ninety-nine",
      "one hundred",
    ];

    return numbers[num - 1] || num.toString();
  };

  // Get theme Chinese name
  const getThemeChineseName = (themeName: string) => {
    const themeChineseNames: { [key: string]: string } = {
      Emotions: "情緒",
      Colors: "顏色",
      Sports: "運動",
      Stationery: "文具",
      Fruits: "水果",
      "Fast Food": "速食",
      "Bakery & Snacks": "烘焙點心",
      "Days of Week": "星期",
      Months: "月份",
      "School Subjects": "學校科目",
      Ailments: "疾病症狀",
      Countries: "國家",
      Furniture: "家具",
      Toys: "玩具",
      Drinks: "飲料",
      "Main Dishes": "主菜",
      "Bubble Tea Toppings": "珍珠奶茶配料",
      Identity: "身份",
      Professions: "職業",
      "Daily Actions": "日常動作",
      Clothing: "衣物",
      "Buildings & Places": "建築物與地點",
      Numbers: "數字",
      "Time Expressions": "時間表達",
    };

    return themeChineseNames[themeName] || "";
  };

  // Handle topic selection
  const handleTopicToggle = (topicName: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicName)
        ? prev.filter((t) => t !== topicName)
        : [...prev, topicName]
    );
  };

  // Handle select all topics
  const handleSelectAllTopics = () => {
    const allTopicNames = themes.map((theme) => theme.name);
    setSelectedTopics(allTopicNames);
  };

  // Handle deselect all topics
  const handleDeselectAllTopics = () => {
    setSelectedTopics([]);
  };

  const displayThemes = React.useMemo(() => {
    if (!themes || themes.length === 0) return [] as WordTheme[];
    const selected = themes.filter((t) => selectedTopics.includes(t.name));
    const unselected = themes.filter((t) => !selectedTopics.includes(t.name));
    return [...selected, ...unselected];
  }, [themes, selectedTopics]);

  // Handle grade change
  const handleGradeChange = (gradeId: number) => {
    setSelectedGrade(gradeId);
  };

  // Handle pattern toggle
  const handlePatternToggle = (patternId: number) => {
    setSelectedPatternIds((prev) => {
      const isCurrentlySelected = prev.includes(patternId);
      let newSelectedPatternIds: number[];

      if (isCurrentlySelected) {
        // 取消勾選句型 - 不影響單字主題選擇
        newSelectedPatternIds = prev.filter((id) => id !== patternId);
      } else {
        // 勾選句型 - 自動勾選對應的單字主題
        newSelectedPatternIds = [...prev, patternId];
      }

      return newSelectedPatternIds;
    });
  };

  // Get current word counts
  const wordCounts = calculateWordCounts();

  const handleStartGame = async () => {
    if (selectedGrade === null) {
      alert("請選擇年級");
      return;
    }

    if (selectedTopics.length === 0) {
      alert("請選擇至少一個單字主題");
      return;
    }

    if (selectedPatternIds.length === 0) {
      alert("請選擇至少一個句型");
      return;
    }

    try {
      // 將主題名稱轉換為主題ID
      const themeIds = selectedTopics
        .map((topicName) => {
          const theme = themes.find((t) => t.name === topicName);
          return theme ? theme.id : null;
        })
        .filter((id): id is number => id !== null);

      if (themeIds.length === 0) {
        alert("無法找到對應的主題ID");
        return;
      }

      // 直接調用 onGameDataReady，傳遞遊戲設定資料
      onGameDataReady({
        grade_id: selectedGrade,
        pattern_ids: selectedPatternIds,
        theme_ids: themeIds, // 現在傳遞數字陣列
        noun_selection: nounSelection,
      });
    } catch (error) {
      console.error("Error fetching game data:", error);
      alert("獲取遊戲資料時發生錯誤");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        遊戲設定選擇器
      </h2>

      {/* 年級選擇 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">選擇年級</h3>
        <div className="grid grid-cols-3 gap-4">
          {grades.map((grade) => (
            <button
              key={grade.id}
              onClick={() => handleGradeChange(grade.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedGrade === grade.id
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300 text-gray-700"
              }`}
            >
              {grade.name}
            </button>
          ))}
        </div>
      </div>

      {/* 句型選擇 */}
      {selectedGrade && sentencePatterns.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            選擇句型 ({selectedPatternIds.length}/{sentencePatterns.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
            {sentencePatterns.map((pattern) => (
              <label
                key={pattern.id}
                className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedPatternIds.includes(pattern.id)}
                  onChange={() => handlePatternToggle(pattern.id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  {pattern.pattern_text}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 推薦單字主題 */}
      {recommendedThemes.length > 0 && (
        <div className="mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <svg
                className="w-5 h-5 text-green-600 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="text-lg font-semibold text-green-800">
                推薦單字主題
              </h3>
            </div>
            <p className="text-sm text-green-700 mb-3">
              根據您選擇的句型，我們推薦以下單字主題，您可以選擇是否要勾選：
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {recommendedThemes.map((rec) => {
                const theme = themes.find((t) => t.id === rec.theme_id);
                if (!theme) return null;

                const isSelected = selectedTopics.includes(theme.name);
                const confidenceColor =
                  rec.confidence > 0.8
                    ? "text-green-600"
                    : rec.confidence > 0.6
                    ? "text-yellow-600"
                    : "text-orange-600";

                return (
                  <div
                    key={rec.theme_id}
                    className="flex items-center p-2 bg-white rounded border border-green-200"
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleTopicToggle(theme.name)}
                        className="text-green-600"
                      />
                      <span className="text-sm font-medium text-black">
                        {theme.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-xs text-green-600">
              💡
              提示：推薦主題是根據句型內容自動分析的，您可以根據教學需求選擇是否使用
            </div>
          </div>
        </div>
      )}

      {/* 選擇單字主題 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black">
            選擇單字主題 ({selectedTopics.length} 個主題)
          </h3>
          <div className="space-x-2">
            <button
              onClick={handleSelectAllTopics}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              全選
            </button>
            <button
              onClick={handleDeselectAllTopics}
              className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              取消全選
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayThemes.map((theme) => {
            const isSelected = selectedTopics.includes(theme.name);
            const wordCount = getWordCountForTheme(theme.name);
            const isVerbTheme = theme.id === 20; // Daily Actions is a verb theme
            const isAdjectiveTheme = theme.id === 1; // Emotions is adjective theme
            const isMixedTheme = theme.id === 2; // Colors has both adjectives and nouns
            const isNumberTheme = theme.id === 23; // Numbers theme

            return (
              <label
                key={theme.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleTopicToggle(theme.name)}
                  className="mr-3 text-blue-600"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-black">{theme.name}</div>
                      <div className="text-sm text-gray-600">
                        {getThemeChineseName(theme.name)}
                      </div>
                    </div>
                    <div className="text-right">
                      {isVerbTheme && (
                        <div className="text-xs text-orange-600">動詞主題</div>
                      )}
                      {isAdjectiveTheme && (
                        <div className="text-xs text-purple-600">
                          形容詞主題
                        </div>
                      )}
                      {isMixedTheme && (
                        <div className="text-xs text-green-600">
                          形容詞+名詞主題
                        </div>
                      )}
                      {isNumberTheme && (
                        <div className="text-xs text-blue-600">數字主題</div>
                      )}
                    </div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 複數型名詞選項 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-black mb-3">
          複數型名詞選項
        </h3>

        {/* 選項說明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-blue-800 mb-2">選項說明</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>
              • <strong>單數型</strong>：只包含可數名詞的單數形式
            </li>
            <li>
              • <strong>複數型</strong>：只包含可數名詞的複數形式
            </li>
            <li>
              • <strong>兩者都放入</strong>：包含可數名詞的單數和複數形式
            </li>
            <li>
              • <strong>注意</strong>
              ：動詞主題（如「日常動作」）和形容詞主題（如「情緒」）不計入複數型名詞選項的計算
            </li>
            <li>
              • <strong>不可數名詞</strong>
              ：無論選擇哪個選項都會包含（包括顏色主題）
            </li>
          </ul>
        </div>

        {/* 選項卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: "singular" as const, label: "單數型" },
            { value: "plural" as const, label: "複數型" },
            { value: "both" as const, label: "兩者都放入" },
          ].map((option) => {
            let description = "";

            switch (option.value) {
              case "singular":
                description = "包含可數名詞的單數形式";
                break;
              case "plural":
                description = "包含可數名詞的複數形式";
                break;
              case "both":
                description = "包含可數名詞的單數和複數形式";
                break;
            }

            return (
              <label
                key={option.value}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                  nounSelection === option.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input
                  type="radio"
                  name="nounSelection"
                  value={option.value}
                  checked={nounSelection === option.value}
                  onChange={(e) =>
                    setNounSelection(
                      e.target.value as "singular" | "plural" | "both"
                    )
                  }
                  className="mr-3 text-blue-600"
                />
                <div className="flex-1">
                  <div className="font-medium text-black mb-1">
                    {option.label}
                  </div>
                  <div className="text-xs text-gray-600">{description}</div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 開始遊戲按鈕 */}
      <div className="text-center">
        <button
          onClick={handleStartGame}
          disabled={
            isLoading ||
            !selectedGrade ||
            selectedPatternIds.length === 0 ||
            selectedTopics.length === 0
          }
          className={`px-8 py-3 rounded-lg font-semibold text-white transition-all ${
            isLoading ||
            !selectedGrade ||
            selectedPatternIds.length === 0 ||
            selectedTopics.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 transform hover:scale-105"
          }`}
        >
          {isLoading ? "載入中..." : "開始遊戲"}
        </button>
      </div>
    </div>
  );
}
