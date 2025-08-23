// 遊戲方法類型
export interface GameMethod {
  id: string;
  title: string;
  description: string;
  category: string;
  grade: "grade1" | "grade2" | "grade3" | "grade4" | "grade5" | "grade6";
  materials: string[];
  instructions: string[];
  createdAt: Date;
  updatedAt: Date;
}

// 站長消息類型
export interface AdminMessage {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// 輔具類型
export interface TeachingAid {
  id: string;
  name: string;
  description: string;
  subject: string;
  grade: "grade1" | "grade2" | "grade3" | "grade4" | "grade5" | "grade6";
  textbookReference?: string;
  materials: string[];
  instructions: string[];
  createdAt: Date;
  updatedAt: Date;
}

// 聯絡表單類型
export interface ContactForm {
  name: string;
  email: string;
  type: string;
  title: string;
  content: string;
}
