/**
 * @fileoverview Game Logic - Pattern handlers for different sentence patterns
 * @modified 2024-12-19 15:30 - 句型拉霸機功能已鎖定保護
 * @modified_by Assistant
 * @modification_type protection
 * @status locked
 * @last_commit 2024-12-19 15:30
 * @feature 句型拉霸機核心邏輯和句型處理器，支援填空題和是非題模式
 * @protection 句型拉霸機相關功能已鎖定，禁止修改，如需類似功能請建立新組件
 */

import { SentencePattern, Word, PatternSlot } from "@/types/learning-content";

// ========================================
// GAME LOGIC UTILITIES
// ========================================

export interface GameWord {
  id: number;
  english_singular: string;
  english_plural?: string;
  chinese_meaning: string;
  part_of_speech: string;
  image_url?: string;
  audio_url?: string;
}

export interface GamePattern {
  id: number;
  pattern_text: string;
  pattern_type: string;
  notes?: string;
  slots: PatternSlot[];
}

// ========================================
// 1. 句型拉霸機 (Sentence Slot Machine)
// ========================================

export interface SlotMachineGame {
  pattern: GamePattern;
  availableWords: GameWord[];
  currentWord: GameWord | null;
  completedSentence: string;
}

export function createSlotMachineGame(
  patterns: GamePattern[],
  words: GameWord[]
): SlotMachineGame {
  // Randomly select a pattern
  const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];

  // Get the required part of speech for the slot
  const requiredPartOfSpeech =
    randomPattern.slots[0]?.required_part_of_speech || "noun";

  // Filter words that match the required part of speech
  const availableWords = words.filter(
    (word) => word.part_of_speech === requiredPartOfSpeech
  );

  // Randomly select a word for the slot
  const randomWord =
    availableWords[Math.floor(Math.random() * availableWords.length)];

  // Create the completed sentence
  const completedSentence = randomPattern.pattern_text.replace(
    "____",
    randomWord.english_singular
  );

  return {
    pattern: randomPattern,
    availableWords,
    currentWord: randomWord,
    completedSentence,
  };
}

export function spinSlotMachine(availableWords: GameWord[]): GameWord {
  return availableWords[Math.floor(Math.random() * availableWords.length)];
}

export function generateSlotMachineSentence(
  pattern: GamePattern,
  word: GameWord
): string {
  return pattern.pattern_text.replace("____", word.english_singular);
}

// ========================================
// SLOT MACHINE PATTERN HANDLERS (Front-end only, extensible)
// ========================================

export interface PatternHandlerResult {
  question: string;
  answer: string;
  selectedWord?: GameWord;
}

export type PatternHandler = (ctx: {
  patternText: string;
  words: GameWord[];
}) => PatternHandlerResult;

function selectRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function toNumberWord(n: number): string {
  const ones = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  const teens = [
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
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];
  if (n < 10) return ones[n];
  if (n < 20) return teens[n - 10];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const r = n % 10;
    return r === 0 ? tens[t] : `${tens[t]} ${ones[r]}`;
  }
  if (n === 100) return "one hundred";
  return String(n);
}

function pickWordByKeywords(
  words: GameWord[],
  keywords: string[]
): GameWord | undefined {
  const set = new Set(keywords.map((k) => k.toLowerCase()));
  const matches = words.filter((w) =>
    set.has(w.english_singular.toLowerCase())
  );
  return matches.length > 0 ? selectRandom(matches) : undefined;
}

function pickAnyNoun(words: GameWord[]): GameWord | undefined {
  const nouns = words.filter((w) => w.part_of_speech === "noun");
  return nouns.length ? selectRandom(nouns) : undefined;
}

function startsWithVowelSound(word: string): boolean {
  return /^[aeiou]/i.test(word);
}

function pickByKeywordsOrPOS(
  words: GameWord[],
  keywords: string[],
  pos?: string
): GameWord | undefined {
  const byKeywords = pickWordByKeywords(words, keywords);
  if (byKeywords) return byKeywords;
  if (pos) {
    const filtered = words.filter((w) => w.part_of_speech === pos);
    return filtered.length ? selectRandom(filtered) : undefined;
  }
  return undefined;
}

// Handler: How old _____?
const howOldHandler: PatternHandler = ({ words }) => {
  const variants = [
    { q: "How old are you?", aPrefix: "I'm" },
    { q: "How old is she?", aPrefix: "She's" },
    { q: "How old is he?", aPrefix: "He's" },
    { q: "How old are they?", aPrefix: "They're" },
  ];
  const v = selectRandom(variants);

  // Prefer to use a number from available words for UI consistency
  const numberKeywords = [
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
  ];
  let picked = pickWordByKeywords(words, numberKeywords);
  let ageNumber: number | null = null;
  if (picked) {
    const c = (picked.chinese_meaning || "").trim();
    const parsed = parseInt(c, 10);
    if (!Number.isNaN(parsed)) {
      ageNumber = parsed;
    } else {
      const map: Record<string, number> = {
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        six: 6,
        seven: 7,
        eight: 8,
        nine: 9,
        ten: 10,
        eleven: 11,
        twelve: 12,
        thirteen: 13,
        fourteen: 14,
        fifteen: 15,
        sixteen: 16,
        seventeen: 17,
        eighteen: 18,
        nineteen: 19,
        twenty: 20,
        "twenty-one": 21,
        "twenty-two": 22,
        "twenty-three": 23,
        "twenty-four": 24,
        "twenty-five": 25,
        "twenty-six": 26,
        "twenty-seven": 27,
        "twenty-eight": 28,
        "twenty-nine": 29,
        thirty: 30,
      };
      ageNumber = map[picked.english_singular.toLowerCase()] ?? null;
    }
  }
  if (ageNumber === null) {
    ageNumber = Math.floor(Math.random() * 6) + 7; // fallback 7-12
    picked = undefined;
  }

  const answer = `${v.aPrefix} ${ageNumber} years old.`;
  return { question: v.q, answer, selectedWord: picked || undefined };
};

// Handler: Generic favorite question with dynamic theme selection
const genericFavoriteHandler: PatternHandler = ({ words }) => {
  const possessive = selectRandom(["your", "his", "her"]);
  const pronounAnswerMap: Record<string, string> = {
    your: "My",
    his: "His",
    her: "Her",
  };

  // 從傳入的 words 中按詞性分類單字
  const nouns = words.filter((word) => word.part_of_speech === "noun");
  const adjectives = words.filter(
    (word) => word.part_of_speech === "adjective"
  );

  // 如果沒有可用單字，返回預設值
  if (nouns.length === 0 && adjectives.length === 0) {
    const fallbackWord = {
      id: -1,
      english_singular: "toy",
      chinese_meaning: "玩具",
      part_of_speech: "noun",
    } as GameWord;

    const question = `What's ${possessive} favorite toy?`;
    const answer = `${pronounAnswerMap[possessive]} favorite toy is ${fallbackWord.english_singular}.`;
    return { question, answer, selectedWord: fallbackWord };
  }

  // 隨機選擇一個可用單字
  const allWords = [...nouns, ...adjectives];
  const selectedWord = selectRandom(allWords);

  // 根據選中單字的詞性決定問題類型
  let questionType: string;
  if (selectedWord.part_of_speech === "adjective") {
    questionType = "color"; // 如果是形容詞，假設是顏色
  } else {
    // 如果是名詞，根據單字內容推測類型
    const wordText = selectedWord.english_singular.toLowerCase();
    if (
      [
        "apple",
        "banana",
        "orange",
        "grape",
        "pear",
        "peach",
        "mango",
        "pineapple",
        "strawberry",
        "watermelon",
      ].some((fruit) => wordText.includes(fruit))
    ) {
      questionType = "fruit";
    } else if (
      [
        "basketball",
        "soccer",
        "baseball",
        "tennis",
        "swimming",
        "running",
      ].some((sport) => wordText.includes(sport))
    ) {
      questionType = "sport";
    } else if (
      ["pen", "pencil", "eraser", "ruler", "marker", "notebook", "book"].some(
        (stationery) => wordText.includes(stationery)
      )
    ) {
      questionType = "stationery";
    } else if (
      ["hamburger", "pizza", "hotdog", "fries", "chicken", "sandwich"].some(
        (food) => wordText.includes(food)
      )
    ) {
      questionType = "food";
    } else if (
      ["doll", "car", "ball", "teddy", "robot", "puzzle", "blocks"].some(
        (toy) => wordText.includes(toy)
      )
    ) {
      questionType = "toy";
    } else if (
      ["water", "milk", "juice", "tea", "coffee", "soda"].some((drink) =>
        wordText.includes(drink)
      )
    ) {
      questionType = "drink";
    } else if (
      ["math", "science", "english", "history", "art", "music"].some(
        (subject) => wordText.includes(subject)
      )
    ) {
      questionType = "subject";
    } else {
      questionType = "thing"; // 預設類型
    }
  }

  const question = `What's ${possessive} favorite ${questionType}?`;
  const answer = `${pronounAnswerMap[possessive]} favorite ${questionType} is ${selectedWord.english_singular}.`;

  return { question, answer, selectedWord };
};

// Handler: Where are you from?
const whereFromHandler: PatternHandler = ({ words }) => {
  const variants = [
    { subj: "you", q: "Where are you from?", aPrefix: "I'm" },
    { subj: "she", q: "Where is she from?", aPrefix: "She's" },
    { subj: "he", q: "Where is he from?", aPrefix: "He's" },
    { subj: "they", q: "Where are they from?", aPrefix: "They're" },
  ];
  const v = selectRandom(variants);
  // Countries from available words or fallback
  const countryKeywords = ["taiwan", "japan", "korea", "usa", "canada"];
  const picked =
    pickWordByKeywords(words, countryKeywords) || pickAnyNoun(words);
  const country = picked ? picked.english_singular : "Taiwan";
  const answer = `${v.aPrefix} from ${country}.`;
  return { question: v.q, answer, selectedWord: picked || undefined };
};

// Handler: Do you like sports? (Enhanced for Yes/No Q&A)
const likeSportsHandler: PatternHandler = ({ words }) => {
  const subjectVariants = [
    { qSubj: "you", qAux: "Do", aSubj: "I", verb: "like" },
    { qSubj: "he", qAux: "Does", aSubj: "He", verb: "likes" },
    { qSubj: "she", qAux: "Does", aSubj: "She", verb: "likes" },
    { qSubj: "they", qAux: "Do", aSubj: "They", verb: "like" },
  ];
  const v = selectRandom(subjectVariants);

  // 從傳入的 words 中選擇運動相關的單字
  const sportsWords = words.filter(
    (word) =>
      word.part_of_speech === "noun" &&
      [
        "basketball",
        "soccer",
        "baseball",
        "tennis",
        "swimming",
        "running",
      ].some((sport) => word.english_singular.toLowerCase().includes(sport))
  );

  // 如果沒有運動單字，使用任何名詞
  const availableWords =
    sportsWords.length > 0
      ? sportsWords
      : words.filter((word) => word.part_of_speech === "noun");

  if (availableWords.length === 0) {
    // 如果完全沒有可用單字，使用預設值
    const fallbackWord = {
      id: -1,
      english_singular: "basketball",
      chinese_meaning: "籃球",
      part_of_speech: "noun",
    } as GameWord;

    const question = `${v.qAux} ${v.qSubj} like ${fallbackWord.english_singular}?`;
    const answer = `Yes, ${
      v.aSubj.toLowerCase() === "i"
        ? "I do"
        : v.aSubj === "They"
        ? "they do"
        : v.aSubj === "He"
        ? "he does"
        : "she does"
    } like ${fallbackWord.english_singular}.`;
    return { question, answer, selectedWord: fallbackWord };
  }

  const picked = selectRandom(availableWords);
  const sport = picked.english_singular;
  const question = `${v.qAux} ${v.qSubj} like ${sport}?`;

  // Random Yes/No
  const isYes = Math.random() < 0.5;

  if (isYes) {
    // Yes 回答：選中的單字是原本問句中的運動，答案句子是 "Yes, I do like basketball."
    const answer = `Yes, ${
      v.aSubj.toLowerCase() === "i"
        ? "I do"
        : v.aSubj === "They"
        ? "they do"
        : v.aSubj === "He"
        ? "he does"
        : "she does"
    } like ${sport}.`;
    return { question, answer, selectedWord: picked || undefined };
  } else {
    // No 回答：選中的單字是隨機的其他運動，答案句子是 "No, I don't. I like soccer."
    // 確保選中的運動與原本問句中的運動不同
    const otherWords = availableWords.filter((w) => w.id !== picked.id);
    const randomWord =
      otherWords.length > 0 ? selectRandom(otherWords) : picked;
    const randomSport = randomWord.english_singular;

    const answer = `No, ${
      v.aSubj.toLowerCase() === "i"
        ? "I don't"
        : v.aSubj === "They"
        ? "they don't"
        : v.aSubj === "He"
        ? "he doesn't"
        : "she doesn't"
    }. ${
      v.aSubj === "I"
        ? "I"
        : v.aSubj === "They"
        ? "They"
        : v.aSubj === "He"
        ? "He"
        : "She"
    } likes ${randomSport}.`;
    return { question, answer, selectedWord: randomWord || undefined };
  }
};

// Handler: Are you a student? (Enhanced for Yes/No Q&A)
const areYouStudentHandler: PatternHandler = ({ words }) => {
  const subjects = [
    { who: "you", qBe: "Are", aYes: "Yes, I am.", aNo: "No, I'm not." },
    { who: "he", qBe: "Is", aYes: "Yes, he is.", aNo: "No, he isn't." },
    { who: "she", qBe: "Is", aYes: "Yes, she is.", aNo: "No, she isn't." },
    {
      who: "they",
      qBe: "Are",
      aYes: "Yes, they are.",
      aNo: "No, they aren't.",
    },
  ];
  const s = selectRandom(subjects);

  // pick a noun from words; fallback to student/students
  const picked = pickAnyNoun(words);
  const singular = picked?.english_singular || "student";
  const plural =
    picked?.english_plural ||
    (singular.endsWith("s") ? singular : `${singular}s`);

  let question: string;
  if (s.who === "they") {
    question = `${s.qBe} they ${plural}?`;
  } else {
    const article = startsWithVowelSound(singular) ? "an" : "a";
    question = `${s.qBe} ${s.who} ${article} ${singular}?`;
  }

  const isYes = Math.random() < 0.5;

  if (isYes) {
    // Yes 回答：選中的單字是原本問句中的職業，答案句子是 "Yes, he is a student."
    if (s.who === "they") {
      const answer = `Yes, they are ${plural}.`;
      return { question, answer, selectedWord: picked || undefined };
    } else {
      const article = startsWithVowelSound(singular) ? "an" : "a";
      const answer = `Yes, ${s.who} is ${article} ${singular}.`;
      return { question, answer, selectedWord: picked || undefined };
    }
  } else {
    // No 回答：選中的單字是隨機的其他職業，答案句子是 "No, He isn't. He is a Teacher."
    // 從傳入的 words 中選擇其他職業單字
    const otherProfessions = words.filter(
      (word) =>
        word.part_of_speech === "noun" &&
        word.id !== picked?.id &&
        [
          "teacher",
          "doctor",
          "nurse",
          "engineer",
          "artist",
          "farmer",
          "worker",
          "student",
        ].some((profession) =>
          word.english_singular.toLowerCase().includes(profession)
        )
    );

    const randomProf =
      otherProfessions.length > 0 ? selectRandom(otherProfessions) : picked;
    const randomNoun = randomProf ? randomProf.english_singular : "teacher";

    if (s.who === "they") {
      const randomPlural =
        randomProf?.english_plural ||
        (randomNoun.endsWith("s") ? randomNoun : `${randomNoun}s`);
      const answer = `No, they aren't. They are ${randomPlural}.`;
      return { question, answer, selectedWord: randomProf || undefined };
    } else {
      const randomArticle = startsWithVowelSound(randomNoun) ? "an" : "a";
      const answer = `No, ${s.who} isn't. ${
        s.who.charAt(0).toUpperCase() + s.who.slice(1)
      } is ${randomArticle} ${randomNoun}.`;
      return { question, answer, selectedWord: randomProf || undefined };
    }
  }
};

// Handler: What color is it? -> pick color adjective
const whatColorIsItHandler: PatternHandler = ({ words }) => {
  // 從傳入的 words 中選擇顏色形容詞
  const colorWords = words.filter(
    (word) =>
      word.part_of_speech === "adjective" &&
      [
        "red",
        "blue",
        "yellow",
        "green",
        "black",
        "white",
        "orange",
        "purple",
        "brown",
        "pink",
      ].some((color) => word.english_singular.toLowerCase().includes(color))
  );

  const picked =
    colorWords.length > 0
      ? selectRandom(colorWords)
      : pickByKeywordsOrPOS(words, [], "adjective");
  const color = picked ? picked.english_singular : "red";
  const question = "What color is it?";
  const answer = `It is ${color}.`;
  return { question, answer, selectedWord: picked || undefined };
};

// Handler: Where's _____? -> pick place/building noun
const wheresBlankHandler: PatternHandler = ({ words }) => {
  // 從傳入的 words 中選擇地點/建築物單字
  const placeWords = words.filter(
    (word) =>
      word.part_of_speech === "noun" &&
      [
        "school",
        "hospital",
        "library",
        "bank",
        "restaurant",
        "cafe",
        "supermarket",
        "store",
        "park",
        "museum",
        "hotel",
        "office",
        "home",
      ].some((place) => word.english_singular.toLowerCase().includes(place))
  );

  const picked =
    placeWords.length > 0
      ? selectRandom(placeWords)
      : pickByKeywordsOrPOS(words, [], "noun");
  const place = picked ? picked.english_singular : "school";
  const question = `Where's the ${place}?`;
  const answer = `It is ${place}.`;
  return { question, answer, selectedWord: picked || undefined };
};

// Handler: What day is today? -> pick weekday
const whatDayIsTodayHandler: PatternHandler = ({ words }) => {
  // 從傳入的 words 中選擇星期單字
  const dayWords = words.filter(
    (word) =>
      word.part_of_speech === "noun" &&
      [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ].some((day) => word.english_singular.toLowerCase().includes(day))
  );

  const picked =
    dayWords.length > 0 ? selectRandom(dayWords) : pickAnyNoun(words);
  const day = picked ? picked.english_singular : "Monday";
  const question = "What day is today?";
  const answer = `It\'s ${day}.`;
  return { question, answer, selectedWord: picked || undefined };
};

// Handler: Do you have a pen/an eraser? -> generalize to stationery noun (Enhanced for Yes/No Q&A)
const doYouHaveStationeryHandler: PatternHandler = ({ words }) => {
  // 從傳入的 words 中選擇文具單字
  const stationeryWords = words.filter(
    (word) =>
      word.part_of_speech === "noun" &&
      ["pen", "pencil", "eraser", "ruler", "marker", "notebook", "book"].some(
        (stationery) => word.english_singular.toLowerCase().includes(stationery)
      )
  );

  const picked =
    stationeryWords.length > 0
      ? selectRandom(stationeryWords)
      : pickAnyNoun(words);
  const noun = picked ? picked.english_singular : "pen";
  const article = startsWithVowelSound(noun) ? "an" : "a";
  const question = `Do you have ${article} ${noun}?`;
  const isYes = Math.random() < 0.5;

  if (isYes) {
    // Yes 回答：選中的單字是原本問句中的文具，答案句子是 "Yes, I do have a pen."
    const answer = `Yes, I do have ${article} ${noun}.`;
    return { question, answer, selectedWord: picked || undefined };
  } else {
    // No 回答：選中的單字是隨機的其他文具，答案句子是 "No, I don't. I have a ruler."
    // 從傳入的 words 中選擇其他文具單字
    const otherStationery = words.filter(
      (word) =>
        word.part_of_speech === "noun" &&
        word.id !== picked?.id &&
        ["pen", "pencil", "eraser", "ruler", "marker", "notebook", "book"].some(
          (stationery) =>
            word.english_singular.toLowerCase().includes(stationery)
        )
    );

    const randomStationery =
      otherStationery.length > 0 ? selectRandom(otherStationery) : picked;
    const randomNoun = randomStationery
      ? randomStationery.english_singular
      : "ruler";
    const randomArticle = startsWithVowelSound(randomNoun) ? "an" : "a";

    const answer = `No, I don't. I have ${randomArticle} ${randomNoun}.`;
    return { question, answer, selectedWord: randomStationery || undefined };
  }
};

// Handler: What would you like to eat? -> pick food
const whatWouldYouLikeToEatHandler: PatternHandler = ({ words }) => {
  // 從傳入的 words 中選擇食物單字
  const foodWords = words.filter(
    (word) =>
      word.part_of_speech === "noun" &&
      [
        "hamburger",
        "bread",
        "cake",
        "pizza",
        "sandwich",
        "noodles",
        "rice",
        "apple",
        "banana",
        "orange",
        "grape",
        "pear",
        "peach",
        "mango",
        "pineapple",
        "strawberry",
        "watermelon",
      ].some((food) => word.english_singular.toLowerCase().includes(food))
  );

  const picked =
    foodWords.length > 0 ? selectRandom(foodWords) : pickAnyNoun(words);
  const food = picked ? picked.english_singular : "hamburger";
  const question = "What would you like to eat?";
  const answer = `I would like some ${food}, please.`;
  return { question, answer, selectedWord: picked || undefined };
};

// Handler: What time do you _____? -> pick daily action + time
const whatTimeDoYouHandler: PatternHandler = ({ words }) => {
  // 從傳入的 words 中選擇日常動作單字
  const actionWords = words.filter(
    (word) =>
      word.part_of_speech === "verb" &&
      [
        "get up",
        "wake up",
        "eat breakfast",
        "go to school",
        "study",
        "read",
        "sleep",
      ].some((action) => word.english_singular.toLowerCase().includes(action))
  );

  const action =
    actionWords.length > 0
      ? selectRandom(actionWords)
      : pickByKeywordsOrPOS(words, [], "verb") || pickAnyNoun(words);
  const actionText = action ? action.english_singular : "get up";

  // 從傳入的 words 中選擇時間表達單字
  const timeWords = words.filter(
    (word) =>
      word.part_of_speech === "noun" &&
      ["o'clock", "half past", "quarter past", "quarter to"].some((timeExpr) =>
        word.english_singular.toLowerCase().includes(timeExpr)
      )
  );

  const timeWord =
    timeWords.length > 0
      ? selectRandom(timeWords)
      : pickByKeywordsOrPOS(words, [], "noun");

  const time = timeWord ? timeWord.english_singular : "seven o'clock";
  const question = "What time do you _____?".replace("_____", actionText);
  const answer = `I ${actionText} at ${time}.`;
  return { question, answer, selectedWord: action || undefined };
};

// Handler: I have a _____ -> Fruits, with a/an
const iHaveAHandler: PatternHandler = ({ words }) => {
  // 從傳入的 words 中選擇水果單字
  const fruitWords = words.filter(
    (word) =>
      word.part_of_speech === "noun" &&
      [
        "apple",
        "banana",
        "orange",
        "grape",
        "pear",
        "peach",
        "mango",
        "pineapple",
        "strawberry",
        "watermelon",
      ].some((fruit) => word.english_singular.toLowerCase().includes(fruit))
  );

  const picked =
    fruitWords.length > 0 ? selectRandom(fruitWords) : pickAnyNoun(words);
  const noun = picked ? picked.english_singular : "apple";
  const article = startsWithVowelSound(noun) ? "an" : "a";
  const question = "I have a _____.".replace("_____", noun);
  const answer = `I have ${article} ${noun}.`;
  return { question, answer, selectedWord: picked || undefined };
};

// Helper: pluralize naive
function toPlural(noun: string, explicitPlural?: string): string {
  if (explicitPlural) return explicitPlural;
  if (
    noun.endsWith("s") ||
    noun.endsWith("x") ||
    noun.endsWith("z") ||
    noun.endsWith("ch") ||
    noun.endsWith("sh")
  )
    return `${noun}es`;
  if (noun.endsWith("y") && !/[aeiou]y$/i.test(noun))
    return `${noun.slice(0, -1)}ies`;
  return `${noun}s`;
}

// Handler: How many _____ do/does (you/he/she/they) need? -> Stationery
const howManyNeedHandler: PatternHandler = ({ words }) => {
  // 從傳入的 words 中選擇文具單字
  const stationeryWords = words.filter(
    (word) =>
      word.part_of_speech === "noun" &&
      ["pen", "pencil", "eraser", "ruler", "marker", "notebook", "book"].some(
        (stationery) => word.english_singular.toLowerCase().includes(stationery)
      )
  );

  const picked =
    stationeryWords.length > 0
      ? selectRandom(stationeryWords)
      : pickAnyNoun(words);
  const singular = picked ? picked.english_singular : "pen";
  const plural = toPlural(singular, picked?.english_plural);

  const subjects = [
    { who: "you", aux: "do", ansSubj: "I", verb: "need" },
    { who: "he", aux: "does", ansSubj: "He", verb: "needs" },
    { who: "she", aux: "does", ansSubj: "She", verb: "needs" },
    { who: "they", aux: "do", ansSubj: "They", verb: "need" },
  ];
  const s = selectRandom(subjects);

  // 從傳入的 words 中選擇數字單字
  const numberWords = words.filter(
    (word) =>
      word.part_of_speech === "noun" &&
      [
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
      ].some((number) => word.english_singular.toLowerCase().includes(number))
  );

  let numberPicked = numberWords.length > 0 ? selectRandom(numberWords) : null;
  let n: number | null = null;
  if (numberPicked) {
    const c = (numberPicked.chinese_meaning || "").trim();
    const parsed = parseInt(c, 10);
    if (!Number.isNaN(parsed)) {
      n = parsed;
    } else {
      const map: Record<string, number> = {
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        six: 6,
        seven: 7,
        eight: 8,
        nine: 9,
        ten: 10,
        eleven: 11,
        twelve: 12,
      };
      n = map[numberPicked.english_singular.toLowerCase()] ?? null;
    }
  }
  if (n === null) {
    n = Math.max(1, Math.floor(Math.random() * 5) + 1);
  }

  const question = `How many ${plural} ${s.aux} ${s.who} need?`;
  const nounForAnswer = n === 1 ? singular : plural;
  const answer = `${s.ansSubj} ${s.verb} ${n} ${nounForAnswer}.`;
  return { question, answer, selectedWord: picked || undefined };
};

// Handler: Do you have lunch at _____? -> Supports both locations and time (Enhanced for Yes/No Q&A)
const haveLunchAtHandler: PatternHandler = ({ words }) => {
  // 優先使用用戶選擇的主題單字
  const availableWords = words.filter(
    (word) =>
      word.part_of_speech === "noun" || word.part_of_speech === "adjective"
  );

  if (availableWords.length === 0) {
    // 如果沒有可用單字，回退到時間邏輯
    const fallback = ["seven", "eight", "nine", "ten", "eleven", "twelve"];
    const text = selectRandom(fallback);
    const fallbackWord = {
      id: -1,
      english_singular: text,
      chinese_meaning: "",
      part_of_speech: "noun",
    } as GameWord;

    const timeText = `${text} o'clock`;
    const question = `Do you have lunch at ${timeText}?`;
    const isYes = Math.random() < 0.5;

    if (isYes) {
      const answer = `Yes, I do have lunch at ${timeText}.`;
      return { question, answer, selectedWord: fallbackWord };
    } else {
      const randomTime = selectRandom(fallback.filter((t) => t !== text));
      const randomTimeText = `${randomTime} o'clock`;
      const randomTimeWord = {
        id: -2,
        english_singular: randomTime,
        chinese_meaning: randomTime,
        part_of_speech: "noun",
      } as GameWord;
      const answer = `No, I don't. I have lunch at ${randomTimeText}.`;
      return { question, answer, selectedWord: randomTimeWord };
    }
  }

  // 隨機選擇一個可用單字
  const selectedWord = selectRandom(availableWords);
  const question = `Do you have lunch at ${selectedWord.english_singular}?`;
  const isYes = Math.random() < 0.5;

  if (isYes) {
    // Yes 回答：選中的單字是原本問句中的單字
    const answer = `Yes, I do have lunch at ${selectedWord.english_singular}.`;
    return { question, answer, selectedWord };
  } else {
    // No 回答：選中的單字是隨機的其他單字
    const otherWords = availableWords.filter((w) => w.id !== selectedWord.id);
    const randomWord = selectRandom(otherWords);
    const answer = `No, I don't. I have lunch at ${randomWord.english_singular}.`;
    return { question, answer, selectedWord: randomWord };
  }
};

// Handler: Are you happy? -> Emotions yes/no (Enhanced for Yes/No Q&A)
const areYouHappyHandler: PatternHandler = ({ words }) => {
  // 從傳入的 words 中選擇情緒形容詞
  const emotionWords = words.filter(
    (word) =>
      word.part_of_speech === "adjective" &&
      ["happy", "tired", "sad", "angry", "excited", "bored", "scared"].some(
        (emotion) => word.english_singular.toLowerCase().includes(emotion)
      )
  );

  // 如果沒有情緒單字，使用預設值
  const emotions =
    emotionWords.length > 0
      ? emotionWords.map((w) => w.english_singular)
      : ["happy", "tired", "sad", "angry", "excited", "bored", "scared"];
  const questionEmotion = selectRandom(emotions);
  const question = `Are you ${questionEmotion}?`;
  const isYes = Math.random() < 0.5;

  if (isYes) {
    // Yes 回答：選中的單字是原本問句中的情緒，答案句子是 "Yes, I am happy."
    const emotionWord = {
      id: 1002,
      english_singular: questionEmotion,
      chinese_meaning: questionEmotion,
      part_of_speech: "adjective",
    } as GameWord;
    const answer = `Yes, I am ${questionEmotion}.`;
    return { question, answer, selectedWord: emotionWord };
  } else {
    // No 回答：選中的單字是隨機的其他情緒，答案句子是 "No, I'm not. I am tired."
    const otherEmotions = emotions.filter((e) => e !== questionEmotion);
    const randomEmotion = selectRandom(otherEmotions);
    const emotionWord = {
      id: 1003,
      english_singular: randomEmotion,
      chinese_meaning: randomEmotion,
      part_of_speech: "adjective",
    } as GameWord;

    const answer = `No, I'm not. I am ${randomEmotion}.`;
    return { question, answer, selectedWord: emotionWord };
  }
};

// Handler: Is he/she a teacher? -> Professions (Enhanced for Slot Machine)
const isHeSheTeacherHandler: PatternHandler = ({ words }) => {
  // 從傳入的 words 中選擇職業單字
  const professionWords = words.filter(
    (word) =>
      word.part_of_speech === "noun" &&
      [
        "teacher",
        "doctor",
        "nurse",
        "engineer",
        "artist",
        "farmer",
        "worker",
      ].some((profession) =>
        word.english_singular.toLowerCase().includes(profession)
      )
  );

  const prof =
    professionWords.length > 0
      ? selectRandom(professionWords)
      : pickAnyNoun(words);
  const noun = prof ? prof.english_singular : "teacher";
  const variants = [
    { who: "he", qBe: "Is", yes: "Yes, he is.", no: "No, he isn't." },
    { who: "she", qBe: "Is", yes: "Yes, she is.", no: "No, she isn't." },
  ];
  const v = selectRandom(variants);
  const article = startsWithVowelSound(noun) ? "an" : "a";
  const question = `${v.qBe} ${v.who} ${article} ${noun}?`;
  const isYes = Math.random() < 0.5;

  if (isYes) {
    // Yes 回答：選中的單字是原本問句中的職業，答案句子是 "Yes, he is a nurse."
    const answer = `Yes, ${v.who} is ${article} ${noun}.`;
    return { question, answer, selectedWord: prof || undefined };
  } else {
    // No 回答：選中的單字是隨機的其他職業，答案句子是 "No, He isn't. He is a Teacher."
    // 從傳入的 words 中選擇其他職業單字
    const otherProfessions = words.filter(
      (word) =>
        word.part_of_speech === "noun" &&
        word.id !== prof?.id &&
        [
          "teacher",
          "doctor",
          "nurse",
          "engineer",
          "artist",
          "farmer",
          "worker",
        ].some((profession) =>
          word.english_singular.toLowerCase().includes(profession)
        )
    );

    const randomProf =
      otherProfessions.length > 0 ? selectRandom(otherProfessions) : prof;
    const randomNoun = randomProf ? randomProf.english_singular : "teacher";
    const randomArticle = startsWithVowelSound(randomNoun) ? "an" : "a";

    const answer = `No, ${v.who} isn't. ${
      v.who.charAt(0).toUpperCase() + v.who.slice(1)
    } is ${randomArticle} ${randomNoun}.`;
    return { question, answer, selectedWord: randomProf || undefined };
  }
};

// Handler: What's this/that? -> Identification (singular)
const whatsThisThatHandler: PatternHandler = ({ words }) => {
  const picked = pickAnyNoun(words);
  const noun = picked ? picked.english_singular : "pen";
  const article = startsWithVowelSound(noun) ? "an" : "a";
  const deictic = selectRandom(["this", "that"]);
  const question = `What\'s ${deictic}?`;
  const answer = `It is ${article} ${noun}.`;
  return { question, answer, selectedWord: picked || undefined };
};

// Handler: What are these/those? -> Identification (plural)
const whatAreTheseThoseHandler: PatternHandler = ({ words }) => {
  const picked = pickAnyNoun(words);
  const singular = picked ? picked.english_singular : "pen";
  const plural = toPlural(singular, picked?.english_plural);
  const deictic = selectRandom(["these", "those"]);
  const question = `What are ${deictic}?`;
  const answer = `They are ${plural}.`;
  return { question, answer, selectedWord: picked || undefined };
};

// Handler: Who is he/she? -> Professions/Identity
const whoIsHeSheHandler: PatternHandler = ({ words }) => {
  // 從傳入的 words 中選擇職業單字
  const professionWords = words.filter(
    (word) =>
      word.part_of_speech === "noun" &&
      [
        "teacher",
        "doctor",
        "nurse",
        "engineer",
        "artist",
        "farmer",
        "worker",
        "student",
      ].some((profession) =>
        word.english_singular.toLowerCase().includes(profession)
      )
  );

  const prof =
    professionWords.length > 0
      ? selectRandom(professionWords)
      : pickAnyNoun(words);
  const noun = prof ? prof.english_singular : "teacher";
  const who = selectRandom(["he", "she"]);
  const article = startsWithVowelSound(noun) ? "an" : "a";
  const question = `Who is ${who}?`;
  const answer = `${
    who.charAt(0).toUpperCase() + who.slice(1)
  } is ${article} ${noun}.`;
  return { question, answer, selectedWord: prof || undefined };
};

// Handler: What does he/she like? -> Preferences
const whatDoesHeSheLikeHandler: PatternHandler = ({ words }) => {
  const picked =
    pickWordByKeywords(words, [
      "basketball",
      "soccer",
      "baseball",
      "pizza",
      "cake",
      "tea",
      "coffee",
      "apple",
      "banana",
    ]) || pickAnyNoun(words);
  const thing = picked ? picked.english_singular : "pizza";
  const who = selectRandom(["he", "she"]);
  const question = `What does ${who} like?`;
  const answer = `${
    who.charAt(0).toUpperCase() + who.slice(1)
  } likes ${thing}.`;
  return { question, answer, selectedWord: picked || undefined };
};

// Handler: How much is it? -> simple price
const howMuchIsItHandler: PatternHandler = () => {
  const question = "How much is it?";
  const dollars = Math.floor(Math.random() * 10) + 1; // $1-$10
  const answer = `It\'s ${dollars} dollars.`;
  return { question, answer };
};

// Handler: Is he/she from _____? -> Countries yes/no (Enhanced for Yes/No Q&A)
const isHeSheFromHandler: PatternHandler = ({ words }) => {
  // 從傳入的 words 中選擇國家單字
  const countryWords = words.filter(
    (word) =>
      word.part_of_speech === "noun" &&
      ["taiwan", "japan", "korea", "usa", "canada", "australia"].some(
        (country) => word.english_singular.toLowerCase().includes(country)
      )
  );

  const country =
    countryWords.length > 0 ? selectRandom(countryWords) : pickAnyNoun(words);
  const name = country ? country.english_singular : "Taiwan";
  const who = selectRandom(["he", "she"]);
  const question = `Is ${who} from ${name}?`;
  const isYes = Math.random() < 0.5;

  if (isYes) {
    // Yes 回答：選中的單字是原本問句中的國家，答案句子是 "Yes, he is from Taiwan."
    const answer = `Yes, ${who} is from ${name}.`;
    return { question, answer, selectedWord: country || undefined };
  } else {
    // No 回答：選中的單字是隨機的其他國家，答案句子是 "No, he isn't. He is from Japan."
    // 從傳入的 words 中選擇其他國家單字
    const otherCountryWords = words.filter(
      (word) =>
        word.part_of_speech === "noun" &&
        word.id !== country?.id &&
        ["taiwan", "japan", "korea", "usa", "canada", "australia"].some(
          (countryName) =>
            word.english_singular.toLowerCase().includes(countryName)
        )
    );

    const randomCountry =
      otherCountryWords.length > 0 ? selectRandom(otherCountryWords) : country;

    const randomName = randomCountry ? randomCountry.english_singular : "Japan";

    const answer = `No, ${who} isn't. ${
      who.charAt(0).toUpperCase() + who.slice(1)
    } is from ${randomName}.`;
    return { question, answer, selectedWord: randomCountry };
  }
};

// Handler: Would you like some _____? -> Bakery & Drinks
const wouldYouLikeSomeHandler: PatternHandler = ({ words }) => {
  // 從傳入的 words 中選擇烘焙和飲料單字
  const bakeryDrinkWords = words.filter(
    (word) =>
      word.part_of_speech === "noun" &&
      ["bread", "cake", "cookie", "tea", "juice", "milk", "soda"].some((item) =>
        word.english_singular.toLowerCase().includes(item)
      )
  );

  const picked =
    bakeryDrinkWords.length > 0
      ? selectRandom(bakeryDrinkWords)
      : pickAnyNoun(words);
  const item = picked ? picked.english_singular : "tea";
  const question = `Would you like some ${item}?`;
  const answer = selectRandom(["Yes, please.", "No, thanks."]);
  return { question, answer, selectedWord: picked || undefined };
};

export const patternHandlers: Record<string, PatternHandler> = {
  "How old _____?": howOldHandler,
  "What's your/his/her favorite subject?": genericFavoriteHandler,
  "Where are you from?": whereFromHandler,
  "Do you like sports?": likeSportsHandler,
  // Generalized yes/no tea preference with subject variants (Enhanced for Yes/No Q&A)
  "Does he/she like tea?": ({ words }) => {
    const subjects = [
      { qAux: "Do", who: "you", aYes: "Yes, I do.", aNo: "No, I don't." },
      {
        qAux: "Does",
        who: "he",
        aYes: "Yes, he does.",
        aNo: "No, he doesn't.",
      },
      {
        qAux: "Does",
        who: "she",
        aYes: "Yes, she does.",
        aNo: "No, she doesn't.",
      },
      {
        qAux: "Do",
        who: "they",
        aYes: "Yes, they do.",
        aNo: "No, they don't.",
      },
    ];
    const s = selectRandom(subjects);

    // 從傳入的 words 中選擇飲料單字
    const drinkWords = words.filter(
      (word) =>
        word.part_of_speech === "noun" &&
        ["tea", "coffee", "juice", "milk", "water", "soda"].some((drink) =>
          word.english_singular.toLowerCase().includes(drink)
        )
    );

    const picked =
      drinkWords.length > 0
        ? selectRandom(drinkWords)
        : ({
            id: -4,
            english_singular: "tea",
            chinese_meaning: "茶",
            part_of_speech: "noun",
          } as GameWord);

    const drink = picked.english_singular;
    const question = `${s.qAux} ${s.who} like ${drink}?`;
    const isYes = Math.random() < 0.5;

    if (isYes) {
      // Yes 回答：選中的單字是原本問句中的飲料，答案句子是 "Yes, he does like tea."
      if (s.who === "you") {
        const answer = `Yes, I do like ${drink}.`;
        return { question, answer, selectedWord: picked };
      } else {
        const answer = `Yes, ${s.who} does like ${drink}.`;
        return { question, answer, selectedWord: picked };
      }
    } else {
      // No 回答：選中的單字是隨機的其他飲料，答案句子是 "No, he doesn't. He likes coffee."
      // 從傳入的 words 中選擇其他飲料單字
      const otherDrinkWords = drinkWords.filter(
        (word) => word.id !== picked.id
      );
      const randomDrink =
        otherDrinkWords.length > 0 ? selectRandom(otherDrinkWords) : picked;

      if (s.who === "you") {
        const answer = `No, I don't. I like ${randomDrink.english_singular}.`;
        return { question, answer, selectedWord: randomDrink };
      } else {
        const answer = `No, ${s.who} doesn't. ${
          s.who.charAt(0).toUpperCase() + s.who.slice(1)
        } likes ${randomDrink.english_singular}.`;
        return { question, answer, selectedWord: randomDrink };
      }
    }
  },
  // Generalized fever yes/no with subject variants (Enhanced for Yes/No Q&A)
  "Does he/she have a fever?": ({ words }) => {
    const subjects = [
      { qAux: "Do", who: "you", aYes: "Yes, I do.", aNo: "No, I don't." },
      {
        qAux: "Does",
        who: "he",
        aYes: "Yes, he does.",
        aNo: "No, he doesn't.",
      },
      {
        qAux: "Does",
        who: "she",
        aYes: "Yes, she does.",
        aNo: "No, she doesn't.",
      },
      {
        qAux: "Do",
        who: "they",
        aYes: "Yes, they do.",
        aNo: "No, they don't.",
      },
    ];
    const s = selectRandom(subjects);

    // 從傳入的 words 中選擇症狀單字
    const ailmentWords = words.filter(
      (word) =>
        word.part_of_speech === "noun" &&
        ["headache", "fever", "toothache", "stomachache", "cold", "cough"].some(
          (ailment) => word.english_singular.toLowerCase().includes(ailment)
        )
    );

    const picked =
      ailmentWords.length > 0
        ? selectRandom(ailmentWords)
        : pickWordByKeywords(words, ["fever"]);
    const ailment = picked ? picked.english_singular : "fever";

    const question = `${s.qAux} ${s.who} have a ${ailment}?`;
    const isYes = Math.random() < 0.5;

    if (isYes) {
      // Yes 回答：選中的單字是原本問句中的症狀，答案句子是 "Yes, he does have a fever."
      const answer = `Yes, ${s.who} does have a ${ailment}.`;
      return { question, answer, selectedWord: picked || undefined };
    } else {
      // No 回答：選中的單字是隨機的其他症狀，答案句子是 "No, he doesn't. He has a headache."
      // 從傳入的 words 中選擇其他症狀單字
      const otherAilmentWords = ailmentWords.filter(
        (word) => word.id !== picked?.id
      );
      const randomPicked =
        otherAilmentWords.length > 0 ? selectRandom(otherAilmentWords) : picked;
      const randomAil = randomPicked
        ? randomPicked.english_singular
        : "headache";

      const answer = `No, ${s.who} doesn't. ${
        s.who.charAt(0).toUpperCase() + s.who.slice(1)
      } has a ${randomAil}.`;
      return { question, answer, selectedWord: randomPicked || undefined };
    }
  },
  "Are you a student?": areYouStudentHandler,
  "What color is it?": whatColorIsItHandler,
  "Where's _____?": wheresBlankHandler,
  "What day is today?": whatDayIsTodayHandler,
  "Do you have a pen/an eraser?": doYouHaveStationeryHandler,
  "What would you like to eat?": whatWouldYouLikeToEatHandler,
  "What time do you _____?": whatTimeDoYouHandler,
  "I have a _____.": iHaveAHandler,
  "How many _____ do you need?": howManyNeedHandler,
  "Do you have lunch at _____?": haveLunchAtHandler,
  "Are you happy?": areYouHappyHandler,
  "Is he/she a teacher?": isHeSheTeacherHandler,
  "What's this/that?": whatsThisThatHandler,
  "What are these/those?": whatAreTheseThoseHandler,
  "Who is he/she?": whoIsHeSheHandler,
  "What does he/she like?": whatDoesHeSheLikeHandler,
  "How much is it?": howMuchIsItHandler,
  "Is he/she from _____?": isHeSheFromHandler,
  "Would you like some _____?": wouldYouLikeSomeHandler,
};

// ========================================
// 2. 短句接龍 (Sentence Chain)
// ========================================

export interface SentenceChainGame {
  pattern: GamePattern;
  availableWords: GameWord[];
  sentenceStart: string;
  requiredPartOfSpeech: string;
  correctAnswer: string;
  completedSentence: string;
}

export function createSentenceChainGame(
  patterns: GamePattern[],
  words: GameWord[]
): SentenceChainGame {
  // Randomly select a pattern
  const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];

  // Get the required part of speech for the slot
  const requiredPartOfSpeech =
    randomPattern.slots[0]?.required_part_of_speech || "noun";

  // Filter words that match the required part of speech
  const availableWords = words.filter(
    (word) => word.part_of_speech === requiredPartOfSpeech
  );

  // Randomly select a word for the slot
  const randomWord =
    availableWords[Math.floor(Math.random() * availableWords.length)];

  // Create the sentence start (everything before the blank)
  const sentenceParts = randomPattern.pattern_text.split("____");
  const sentenceStart = sentenceParts[0];

  // Create the completed sentence
  const completedSentence = randomPattern.pattern_text.replace(
    "____",
    randomWord.english_singular
  );

  return {
    pattern: randomPattern,
    availableWords,
    sentenceStart,
    requiredPartOfSpeech,
    correctAnswer: randomWord.english_singular,
    completedSentence,
  };
}

export function validateSentenceChainAnswer(
  userAnswer: string,
  correctAnswer: string,
  requiredPartOfSpeech: string,
  availableWords: GameWord[]
): {
  isCorrect: boolean;
  feedback: string;
  suggestions?: string[];
} {
  const normalizedUserAnswer = userAnswer.trim().toLowerCase();
  const normalizedCorrectAnswer = correctAnswer.toLowerCase();

  // Check if the answer is exactly correct
  if (normalizedUserAnswer === normalizedCorrectAnswer) {
    return {
      isCorrect: true,
      feedback: "正確！",
    };
  }

  // Check if the answer is a valid word with the correct part of speech
  const isValidWord = availableWords.some(
    (word) =>
      word.english_singular.toLowerCase() === normalizedUserAnswer ||
      (word.english_plural &&
        word.english_plural.toLowerCase() === normalizedUserAnswer)
  );

  if (isValidWord) {
    return {
      isCorrect: true,
      feedback: "正確！雖然不是預期的答案，但語法正確。",
    };
  }

  // Provide suggestions for similar words
  const suggestions = availableWords
    .filter(
      (word) =>
        word.english_singular.toLowerCase().includes(normalizedUserAnswer) ||
        normalizedUserAnswer.includes(word.english_singular.toLowerCase())
    )
    .slice(0, 3)
    .map((word) => word.english_singular);

  return {
    isCorrect: false,
    feedback: `請輸入一個${getPartOfSpeechDisplayName(requiredPartOfSpeech)}。`,
    suggestions,
  };
}

// ========================================
// 3. 投影幕問答 (Projection QA)
// ========================================

export interface ProjectionQAGame {
  question: string;
  correctAnswer: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

export function createProjectionQAGame(
  patterns: GamePattern[],
  words: GameWord[],
  gameType: "fill_blank" | "question_answer" = "fill_blank"
): ProjectionQAGame {
  if (gameType === "fill_blank") {
    return createFillBlankQuestion(patterns, words);
  } else {
    return createQuestionAnswerQuestion(patterns, words);
  }
}

function createFillBlankQuestion(
  patterns: GamePattern[],
  words: GameWord[]
): ProjectionQAGame {
  // Randomly select a pattern
  const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];

  // Get the required part of speech for the slot
  const requiredPartOfSpeech =
    randomPattern.slots[0]?.required_part_of_speech || "noun";

  // Filter words that match the required part of speech
  const availableWords = words.filter(
    (word) => word.part_of_speech === requiredPartOfSpeech
  );

  // Randomly select a word for the correct answer
  const correctWord =
    availableWords[Math.floor(Math.random() * availableWords.length)];

  // Create the question (pattern with blank)
  const question = randomPattern.pattern_text;

  // Generate incorrect options from other words
  const otherWords = availableWords.filter(
    (word) => word.id !== correctWord.id
  );
  const incorrectOptions = otherWords
    .slice(0, 3)
    .map((word) => word.english_singular);

  // If we don't have enough words, add some generic options
  while (incorrectOptions.length < 3) {
    incorrectOptions.push(getGenericWord(requiredPartOfSpeech));
  }

  // Shuffle options and add correct answer
  const allOptions = [...incorrectOptions, correctWord.english_singular];
  shuffleArray(allOptions);

  const correctOptionIndex = allOptions.indexOf(correctWord.english_singular);

  return {
    question,
    correctAnswer: correctWord.english_singular,
    options: allOptions,
    correctOptionIndex,
    explanation: `正確答案是 "${
      correctWord.english_singular
    }"，因為這個句型需要一個${getPartOfSpeechDisplayName(
      requiredPartOfSpeech
    )}。`,
  };
}

function createQuestionAnswerQuestion(
  patterns: GamePattern[],
  words: GameWord[]
): ProjectionQAGame {
  // Find a question pattern and a statement pattern
  const questionPatterns = patterns.filter(
    (p) => p.pattern_type === "Question"
  );
  const statementPatterns = patterns.filter(
    (p) => p.pattern_type === "Statement"
  );

  if (questionPatterns.length === 0 || statementPatterns.length === 0) {
    // Fallback to fill blank if no suitable patterns
    return createFillBlankQuestion(patterns, words);
  }

  const questionPattern =
    questionPatterns[Math.floor(Math.random() * questionPatterns.length)];
  const statementPattern =
    statementPatterns[Math.floor(Math.random() * statementPatterns.length)];

  const question = questionPattern.pattern_text;
  const correctAnswer = statementPattern.pattern_text;

  // Generate incorrect options
  const incorrectOptions = [
    "I like pizza.",
    "The weather is nice.",
    "She is reading a book.",
  ];

  // Shuffle options and add correct answer
  const allOptions = [...incorrectOptions, correctAnswer];
  shuffleArray(allOptions);

  const correctOptionIndex = allOptions.indexOf(correctAnswer);

  return {
    question,
    correctAnswer,
    options: allOptions,
    correctOptionIndex,
    explanation: "這是一個問答配對題，需要選擇最適合回答問題的句子。",
  };
}

// ========================================
// 4. 文法修正 (Grammar Correction)
// ========================================

export interface GrammarCorrectionGame {
  incorrectSentence: string;
  correctSentence: string;
  errorType: "subject_verb_agreement" | "plural_form" | "tense" | "article";
  errorDescription: string;
  hints: string[];
}

export function createGrammarCorrectionGame(
  patterns: GamePattern[],
  words: GameWord[]
): GrammarCorrectionGame {
  // Randomly select a pattern
  const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];

  // Get the required part of speech for the slot
  const requiredPartOfSpeech =
    randomPattern.slots[0]?.required_part_of_speech || "noun";

  // Filter words that match the required part of speech
  const availableWords = words.filter(
    (word) => word.part_of_speech === requiredPartOfSpeech
  );

  // Randomly select a word
  const selectedWord =
    availableWords[Math.floor(Math.random() * availableWords.length)];

  // Create the correct sentence
  const correctSentence = randomPattern.pattern_text.replace(
    "____",
    selectedWord.english_singular
  );

  // Generate an incorrect version based on error type
  const errorType = getRandomErrorType();
  const { incorrectSentence, errorDescription, hints } =
    generateIncorrectSentence(
      correctSentence,
      errorType,
      selectedWord,
      randomPattern
    );

  return {
    incorrectSentence,
    correctSentence,
    errorType,
    errorDescription,
    hints,
  };
}

function getRandomErrorType():
  | "subject_verb_agreement"
  | "plural_form"
  | "tense"
  | "article" {
  const types = ["subject_verb_agreement", "plural_form", "tense", "article"];
  return types[Math.floor(Math.random() * types.length)] as any;
}

function generateIncorrectSentence(
  correctSentence: string,
  errorType: string,
  word: GameWord,
  pattern: GamePattern
): {
  incorrectSentence: string;
  errorDescription: string;
  hints: string[];
} {
  let incorrectSentence = correctSentence;
  let errorDescription = "";
  let hints: string[] = [];

  switch (errorType) {
    case "subject_verb_agreement":
      // Change singular verb to plural or vice versa
      if (pattern.pattern_text.includes("likes")) {
        incorrectSentence = incorrectSentence.replace("likes", "like");
        errorDescription = "主詞動詞不一致";
        hints = ["檢查主詞是單數還是複數", "單數主詞要用單數動詞"];
      } else if (pattern.pattern_text.includes("like")) {
        incorrectSentence = incorrectSentence.replace("like", "likes");
        errorDescription = "主詞動詞不一致";
        hints = ["檢查主詞是單數還是複數", "複數主詞要用複數動詞"];
      }
      break;

    case "plural_form":
      // Use singular form when plural is needed or vice versa
      if (word.english_plural) {
        incorrectSentence = incorrectSentence.replace(
          word.english_singular,
          word.english_plural
        );
        errorDescription = "單複數形式錯誤";
        hints = ["檢查是否需要冠詞", "可數名詞單數前通常需要冠詞"];
      }
      break;

    case "tense":
      // Change present tense to past tense
      if (pattern.pattern_text.includes("likes")) {
        incorrectSentence = incorrectSentence.replace("likes", "liked");
        errorDescription = "時態錯誤";
        hints = ["檢查句子是否談論過去", "現在式 vs 過去式"];
      }
      break;

    case "article":
      // Remove or change article
      if (pattern.pattern_text.includes("a ____")) {
        incorrectSentence = incorrectSentence.replace("a ", "");
        errorDescription = "冠詞使用錯誤";
        hints = ["可數名詞單數前通常需要冠詞", "檢查是 a 還是 an"];
      }
      break;
  }

  return { incorrectSentence, errorDescription, hints };
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function getPartOfSpeechDisplayName(partOfSpeech: string): string {
  const displayNames: Record<string, string> = {
    noun: "名詞",
    verb: "動詞",
    adjective: "形容詞",
    adverb: "副詞",
    preposition: "介系詞",
  };
  return displayNames[partOfSpeech] || partOfSpeech;
}

function getGenericWord(partOfSpeech: string): string {
  const genericWords: Record<string, string[]> = {
    noun: ["book", "car", "house", "tree"],
    adjective: ["big", "small", "good", "bad"],
    verb: ["run", "walk", "eat", "sleep"],
    adverb: ["quickly", "slowly", "well", "badly"],
    preposition: ["in", "on", "at", "by"],
  };

  const words = genericWords[partOfSpeech] || ["word"];
  return words[Math.floor(Math.random() * words.length)];
}

function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Helper to get the correct verb prefix for action replacement
function getActionPrefix(action: string): string {
  if (action.toLowerCase().includes("go")) {
    return "go";
  } else if (action.toLowerCase().includes("read")) {
    return "read";
  } else if (action.toLowerCase().includes("cook")) {
    return "cook";
  } else if (action.toLowerCase().includes("eat")) {
    return "eat";
  } else if (action.toLowerCase().includes("sleep")) {
    return "sleep";
  } else if (action.toLowerCase().includes("swim")) {
    return "swim";
  } else if (action.toLowerCase().includes("hike")) {
    return "hike";
  } else {
    return ""; // Default prefix if not recognized
  }
}

// Helper to get Chinese translation for numbers
function getNumberChinese(number: string): string {
  const numberMap: Record<string, string> = {
    one: "一",
    two: "二",
    three: "三",
    four: "四",
    five: "五",
    six: "六",
    seven: "七",
    eight: "八",
    nine: "九",
    ten: "十",
    eleven: "十一",
    twelve: "十二",
    thirteen: "十三",
    fourteen: "十四",
    fifteen: "十五",
    sixteen: "十六",
    seventeen: "十七",
    eighteen: "十八",
    nineteen: "十九",
    twenty: "二十",
    "twenty-one": "二十一",
    "twenty-two": "二十二",
    "twenty-three": "二十三",
    "twenty-four": "二十四",
    "twenty-five": "二十五",
    "twenty-six": "二十六",
    "twenty-seven": "二十七",
    "twenty-eight": "二十八",
    "twenty-nine": "二十九",
    thirty: "三十",
  };
  return numberMap[number] || number;
}

// Helper to get Chinese translation for time expressions
function getTimeChinese(time: string): string {
  const timeMap: Record<string, string> = {
    one: "一點",
    two: "兩點",
    three: "三點",
    four: "四點",
    five: "五點",
    six: "六點",
    seven: "七點",
    eight: "八點",
    nine: "九點",
    ten: "十點",
    eleven: "十一點",
    twelve: "十二點",
    "half past": "半點",
    "quarter past": "一刻",
    "quarter to": "差一刻",
  };
  return timeMap[time] || time;
}

// ========================================
// GAME STATE MANAGEMENT
// ========================================

export interface GameState {
  currentGame:
    | "slot_machine"
    | "sentence_chain"
    | "projection_qa"
    | "grammar_correction";
  gameData:
    | SlotMachineGame
    | SentenceChainGame
    | ProjectionQAGame
    | GrammarCorrectionGame
    | null;
  score: number;
  totalQuestions: number;
  currentQuestion: number;
}

export function initializeGameState(): GameState {
  return {
    currentGame: "slot_machine",
    gameData: null,
    score: 0,
    totalQuestions: 10,
    currentQuestion: 1,
  };
}

export function updateGameScore(
  currentState: GameState,
  isCorrect: boolean
): GameState {
  return {
    ...currentState,
    score: isCorrect ? currentState.score + 1 : currentState.score,
    currentQuestion: currentState.currentQuestion + 1,
  };
}

export function isGameComplete(gameState: GameState): boolean {
  return gameState.currentQuestion > gameState.totalQuestions;
}

export function getGameProgress(gameState: GameState): number {
  return (gameState.currentQuestion - 1) / gameState.totalQuestions;
}
