# 開發指南

## 概述

本文件整合了 Primary English Support 專案的所有開發相關文檔，包括開發環境設定、程式碼規範、測試指南和最佳實踐等內容。

## 🛠️ 開發環境設定

### 環境要求

- **Node.js**: 18+ 版本
- **npm**: 9+ 版本
- **Git**: 2.30+ 版本
- **VS Code**: 推薦使用 VS Code 作為編輯器

### 專案結構

```
primary-english-support/
├── src/                          # 主要源碼
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API 路由
│   │   ├── games/                # 遊戲頁面
│   │   ├── aids/                 # 學習輔助頁面
│   │   └── garden/               # 管理介面
│   ├── components/               # 共用組件
│   ├── lib/                      # 工具函數和配置
│   └── types/                    # TypeScript 類型定義
├── functions/                     # Cloudflare Worker 函數
├── scripts/                       # 腳本和工具
├── doc/                          # 文檔
└── public/                       # 靜態資源
```

### 安裝依賴

```bash
# 安裝專案依賴
npm install

# 安裝全域工具
npm install -g wrangler vercel
```

### 環境變數設定

創建 `.env.local` 文件：

```bash
# Cloudflare 配置
CLOUDFLARE_WORKER_URL=http://localhost:8787
CLOUDFLARE_API_SECRET=local-dev-secret
NODE_ENV=development

# EmailJS 配置
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key
```

## 🚀 開發流程

### 啟動開發環境

#### 完整開發環境
```bash
# 啟動完整開發環境（推薦）
npm run dev:full
```

#### 分別啟動服務
```bash
# 終端 1: 啟動 Cloudflare Worker
npm run dev:worker

# 終端 2: 啟動 Next.js 應用
npm run dev
```

### 開發腳本

```bash
# 開發相關腳本
npm run dev          # 啟動 Next.js 開發伺服器
npm run dev:worker   # 啟動 Cloudflare Worker
npm run dev:full     # 啟動完整開發環境
npm run build        # 建置專案
npm run start        # 啟動生產環境
npm run lint         # 執行 ESLint 檢查
npm run type-check   # 執行 TypeScript 類型檢查
```

### 部署腳本

```bash
# 部署相關腳本
npm run deploy:worker    # 部署 Cloudflare Worker
npm run deploy:vercel    # 部署到 Vercel
npm run deploy:full      # 完整部署
```

## 📝 程式碼規範

### TypeScript 規範

#### 類型定義
```typescript
// 使用明確的類型定義
interface GameMethod {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: '簡單' | '中等' | '困難';
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// 使用泛型
interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
```

#### 函數定義
```typescript
// 使用明確的參數和回傳類型
const fetchGameMethods = async (): Promise<APIResponse<GameMethod[]>> => {
  try {
    const response = await fetch('/api/games');
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
```

#### 組件定義
```typescript
// 使用 React.FC 或明確的組件類型
interface GameMethodCardProps {
  gameMethod: GameMethod;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const GameMethodCard: React.FC<GameMethodCardProps> = ({
  gameMethod,
  onEdit,
  onDelete
}) => {
  return (
    <div className="game-method-card">
      <h3>{gameMethod.title}</h3>
      <p>{gameMethod.description}</p>
      {/* 其他內容 */}
    </div>
  );
};
```

### React 規範

#### 組件結構
```typescript
// 組件檔案結構
import React, { useState, useEffect } from 'react';
import { GameMethod } from '@/types';

interface ComponentProps {
  // 屬性定義
}

const Component: React.FC<ComponentProps> = ({ ...props }) => {
  // 狀態定義
  const [state, setState] = useState<StateType>(initialValue);
  
  // 副作用
  useEffect(() => {
    // 副作用邏輯
  }, [dependencies]);
  
  // 事件處理函數
  const handleEvent = (event: EventType) => {
    // 事件處理邏輯
  };
  
  // 渲染邏輯
  return (
    <div>
      {/* JSX 內容 */}
    </div>
  );
};

export default Component;
```

#### Hooks 使用
```typescript
// 自定義 Hook
const useGameMethods = () => {
  const [gameMethods, setGameMethods] = useState<GameMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchGameMethods = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/games');
      const data = await response.json();
      setGameMethods(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchGameMethods();
  }, []);
  
  return { gameMethods, loading, error, refetch: fetchGameMethods };
};
```

### CSS 規範

#### Tailwind CSS 使用
```typescript
// 使用 Tailwind CSS 類別
<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
  <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">
      遊戲方法
    </h1>
    <p className="text-gray-600 mb-6">
      選擇適合的遊戲方法來學習英語
    </p>
  </div>
</div>
```

#### 響應式設計
```typescript
// 響應式設計
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="p-4 bg-white rounded-lg shadow">
    <h3 className="text-lg font-semibold mb-2">標題</h3>
    <p className="text-gray-600">內容</p>
  </div>
</div>
```

### 檔案命名規範

#### 組件檔案
```
components/
├── GameMethodCard.tsx      # 大寫開頭，PascalCase
├── TextbookSelector.tsx    # 大寫開頭，PascalCase
└── SEOHead.tsx            # 大寫開頭，PascalCase
```

#### 工具檔案
```
lib/
├── game-logic.ts          # 小寫開頭，camelCase
├── cloudflare-client.ts   # 小寫開頭，camelCase
└── utils.ts              # 小寫開頭，camelCase
```

#### 頁面檔案
```
app/
├── page.tsx              # 小寫開頭，camelCase
├── games/
│   └── page.tsx         # 小寫開頭，camelCase
└── aids/
    └── memory-match/
        └── page.tsx     # 小寫開頭，camelCase
```

## 🧪 測試指南

### 測試環境設定

```bash
# 安裝測試依賴
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# 執行測試
npm run test
```

### 單元測試

```typescript
// 組件測試範例
import { render, screen, fireEvent } from '@testing-library/react';
import GameMethodCard from '@/components/GameMethodCard';

const mockGameMethod = {
  id: '1',
  title: '測試遊戲',
  description: '測試描述',
  category: '單字學習',
  difficulty: '簡單',
  is_published: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

describe('GameMethodCard', () => {
  it('renders game method information', () => {
    render(<GameMethodCard gameMethod={mockGameMethod} />);
    
    expect(screen.getByText('測試遊戲')).toBeInTheDocument();
    expect(screen.getByText('測試描述')).toBeInTheDocument();
    expect(screen.getByText('單字學習')).toBeInTheDocument();
  });
  
  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    render(
      <GameMethodCard 
        gameMethod={mockGameMethod} 
        onEdit={mockOnEdit} 
      />
    );
    
    fireEvent.click(screen.getByText('編輯'));
    expect(mockOnEdit).toHaveBeenCalledWith('1');
  });
});
```

### API 測試

```typescript
// API 測試範例
import { GET } from '@/app/api/games/route';

describe('/api/games', () => {
  it('returns game methods', async () => {
    const request = new Request('http://localhost:3000/api/games');
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });
});
```

### 整合測試

```typescript
// 整合測試範例
import { render, screen, waitFor } from '@testing-library/react';
import GamesPage from '@/app/games/page';

describe('Games Page', () => {
  it('loads and displays game methods', async () => {
    render(<GamesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('遊戲方法')).toBeInTheDocument();
    });
    
    // 檢查遊戲方法列表是否載入
    const gameCards = screen.getAllByTestId('game-method-card');
    expect(gameCards.length).toBeGreaterThan(0);
  });
});
```

## 🔧 開發工具

### VS Code 設定

#### 推薦擴展
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-json"
  ]
}
```

#### 工作區設定
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "typescript",
    "typescriptreact": "typescriptreact"
  }
}
```

### ESLint 設定

```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### Prettier 設定

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

## 📦 套件管理

### 依賴管理

```bash
# 安裝生產依賴
npm install package-name

# 安裝開發依賴
npm install --save-dev package-name

# 更新依賴
npm update

# 檢查過期依賴
npm outdated

# 安全檢查
npm audit
```

### 版本控制

```bash
# 檢查套件版本
npm list

# 檢查特定套件
npm list package-name

# 檢查全域套件
npm list -g --depth=0
```

## 🚀 部署流程

### 本地測試

```bash
# 建置專案
npm run build

# 啟動生產環境
npm run start

# 檢查建置結果
npm run type-check
npm run lint
```

### 部署到 Vercel

```bash
# 部署到 Vercel
npm run deploy:vercel

# 檢查部署狀態
vercel ls

# 查看部署日誌
vercel logs
```

### 部署到 Cloudflare

```bash
# 部署 Cloudflare Worker
npm run deploy:worker

# 檢查 Worker 狀態
wrangler tail

# 查看 Worker 日誌
wrangler tail --format=pretty
```

## 🔍 除錯指南

### 常見問題

#### 1. 建置錯誤
```bash
# 清理快取
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

#### 2. 類型錯誤
```bash
# 檢查類型
npm run type-check

# 重新生成類型
npm run build
```

#### 3. 依賴問題
```bash
# 重新安裝依賴
rm -rf node_modules package-lock.json
npm install
```

### 除錯工具

#### 瀏覽器開發者工具
- 使用 Console 查看錯誤訊息
- 使用 Network 檢查 API 請求
- 使用 Sources 設定中斷點

#### Next.js 除錯
```bash
# 啟用詳細日誌
DEBUG=* npm run dev

# 檢查建置資訊
npm run build -- --debug
```

#### Cloudflare Worker 除錯
```bash
# 查看 Worker 日誌
wrangler tail

# 本地除錯
wrangler dev --local
```

## 📊 性能優化

### 程式碼分割

```typescript
// 動態導入
const LazyComponent = dynamic(() => import('./LazyComponent'), {
  loading: () => <p>Loading...</p>
});

// 路由層級分割
const GamesPage = dynamic(() => import('./GamesPage'));
```

### 圖片優化

```typescript
import Image from 'next/image';

// 使用 Next.js Image 組件
<Image
  src="/image.jpg"
  alt="描述"
  width={500}
  height={300}
  priority
/>
```

### 快取策略

```typescript
// API 快取
export const revalidate = 3600; // 1小時

// 靜態生成
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
  ];
}
```

## 📚 相關文檔

- [技術指南](TechnicalGuide.md)
- [資料庫指南](DatabaseGuide.md)
- [安全指南](SecurityGuide.md)
- [遊戲頁面指南](GamePagesGuide.md)
- [學習內容系統](LearningContentSystem.md)

## 🤝 貢獻指南

### 開發流程

1. **Fork 專案**
2. **創建功能分支**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **提交變更**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **推送分支**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **開啟 Pull Request**

### 程式碼審查

- 確保程式碼符合規範
- 添加適當的測試
- 更新相關文檔
- 檢查性能影響

---

**⚠️ 重要提醒**: 本開發指南涵蓋了專案的核心開發流程，請遵循規範進行開發，確保程式碼品質和一致性。
