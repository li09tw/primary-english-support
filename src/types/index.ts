// 遊戲方法類型
export interface GameMethod {
  id: string;
  title: string;
  description: string;
  category: string; // 單一分類，與 D1 表格結構一致
  categories: string[]; // 保持向後兼容
  grades: string[]; // 保持向後兼容
  // 新增布林值年級欄位，與 D1 表格結構一致
  grade1?: boolean;
  grade2?: boolean;
  grade3?: boolean;
  grade4?: boolean;
  grade5?: boolean;
  grade6?: boolean;
  materials: string[];
  instructions: string[];
  steps: string; // 與 D1 表格結構一致
  tips: string; // 與 D1 表格結構一致
  is_published: boolean; // 發布狀態
  createdAt: Date;
  updatedAt: Date;
}

// 站長消息類型
export interface AdminMessage {
  id: string;
  title: string;
  content: string;
  is_published: boolean; // 發布狀態
  createdAt: Date;
}

// 電子教具類型定義
export interface Textbook {
  id: string;
  name: string;
  publisher: string;
  grade: string;
  units: Unit[];
}

export interface Unit {
  id: string;
  name: string;
  vocabulary: Vocabulary[];
}

export interface Vocabulary {
  id: string;
  english: string;
  chinese: string;
  phonetic: string;
  example: string;
  image?: string;
}
