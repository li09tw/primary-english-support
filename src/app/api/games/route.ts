import { NextRequest, NextResponse } from 'next/server';

// 模擬資料庫 - 實際部署時會使用 Cloudflare D1 或 KV
let gameMethods: Array<{
  id: string;
  title: string;
  description: string;
  materials: string[];
  steps: string[];
  grade: 'grade1' | 'grade2' | 'grade3' | 'grade4' | 'grade5' | 'grade6';
  ageGroup: '3-6' | '7-9' | '10-12';
  category: 'vocabulary' | 'grammar' | 'speaking' | 'listening' | 'reading' | 'writing';
  createdAt: string;
  updatedAt: string;
}> = [
  {
    id: '1',
    title: '單字配對遊戲',
    description: '透過配對卡片來學習英語單字，適合初學者。',
    materials: ['單字卡片', '圖片卡片', '計時器'],
    steps: [
      '準備單字卡片和對應的圖片卡片',
      '將卡片打亂排列',
      '學生輪流翻開兩張卡片',
      '如果配對成功，可以繼續翻牌',
      '配對失敗，輪到下一位學生'
    ],
    grade: 'grade1',
    ageGroup: '7-9',
    category: 'vocabulary',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: '句子接龍',
    description: '學生輪流說出句子，培養語感和口語表達能力。',
    materials: ['主題卡片', '計分板'],
    steps: [
      '選擇一個主題（如：動物、食物、顏色）',
      '第一位學生說出一個句子',
      '下一位學生用前一句的最後一個單字開始新句子',
      '持續進行，直到有人無法接下去'
    ],
    grade: 'grade2',
    ageGroup: '10-12',
    category: 'speaking',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// GET /api/games - 獲取遊戲方法列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const grade = searchParams.get('grade');
    const ageGroup = searchParams.get('ageGroup');

    let filteredGames = [...gameMethods];

    if (category) {
      filteredGames = filteredGames.filter(game => game.category === category);
    }
    if (grade) {
      filteredGames = filteredGames.filter(game => game.grade === grade);
    }
    if (ageGroup) {
      filteredGames = filteredGames.filter(game => game.ageGroup === ageGroup);
    }

    return NextResponse.json({
      success: true,
      data: filteredGames.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '獲取遊戲方法失敗' },
      { status: 500 }
    );
  }
}

// POST /api/games - 創建新的遊戲方法
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, materials, steps, grade, ageGroup, category } = body;

    if (!title || !description || !materials || !steps || !grade || !ageGroup || !category) {
      return NextResponse.json(
        { success: false, error: '所有欄位都為必填' },
        { status: 400 }
      );
    }

    const newGame = {
      id: Date.now().toString(),
      title,
      description,
      materials,
      steps,
      grade,
      ageGroup,
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    gameMethods.push(newGame);

    return NextResponse.json({
      success: true,
      data: newGame
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '創建遊戲方法失敗' },
      { status: 500 }
    );
  }
}
