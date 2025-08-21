// 遊戲方法類型
export interface GameMethod {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
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
  priority: 'low' | 'medium' | 'high';
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 輔具類型
export interface TeachingAid {
  id: string;
  name: string;
  description: string;
  subject: string;
  grade: string;
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
  subject: string;
  message: string;
}
