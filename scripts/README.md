# 部署腳本說明

這個目錄包含了 Primary English Support 專案的各種部署和資料庫管理腳本。

## 🚀 主要部署腳本

### `deploy.sh` - 完整部署腳本
**用途**: 執行完整的專案部署流程
**包含步驟**:
1. 檢查部署需求
2. 建置 Next.js 應用
3. 部署 Cloudflare Worker
4. 部署 D1 資料庫結構
5. 部署單字主題關聯
6. 觸發 Vercel 自動部署

**使用方法**:
```bash
./scripts/deploy.sh
```

### `deploy-d1-schema.sh` - D1 資料庫結構部署
**用途**: 部署主要的資料庫結構和單字資料
**包含內容**:
- 年級等級 (Grade 3, 5, 6)
- 單字主題 (24個主題)
- 單字資料 (500+ 個單字)
- 句型模式 (66個模式)
- 資料庫索引

**使用方法**:
```bash
./scripts/deploy-d1-schema.sh
```

### `deploy-word-themes.sh` - 單字主題關聯部署
**用途**: 建立單字與主題的關聯關係
**包含主題**:
- Sports (35個單字)
- Stationery (40個單字)
- Fruits (45個單字)
- Drinks (50個單字)
- Main Dishes (50個單字)
- Furniture (60個單字)
- Countries (80個單字)
- Ailments (100個單字)
- School Subjects (100個單字)

**使用方法**:
```bash
./scripts/deploy-word-themes.sh
```

## 📊 資料庫內容

### 單字主題擴充統計
| 主題 | 原始數量 | 擴充後數量 | 新增數量 |
|------|----------|------------|----------|
| Sports | 8 | 35 | +27 |
| Stationery | 7 | 40 | +33 |
| Fruits | 7 | 45 | +38 |
| Drinks | 6 | 50 | +44 |
| Main Dishes | 6 | 50 | +44 |
| Furniture | 6 | 60 | +54 |
| Countries | 8 | 80 | +72 |
| Ailments | 5 | 100 | +95 |
| School Subjects | 8 | 100 | +92 |

**總計**: 新增 **499個單字**

## 🔧 技術細節

### 資料庫特性
- **使用 `INSERT OR IGNORE`**: 避免重複插入錯誤
- **遠端部署**: 支援 Cloudflare D1 生產資料庫
- **配置檔案**: 使用 `wrangler-api-gateway.toml`
- **資料庫綁定**: `PRIMARY_ENGLISH_DB`

### 部署流程
1. **本地開發**: 使用 `wrangler-dev.toml`
2. **生產部署**: 使用 `wrangler-api-gateway.toml`
3. **自動化**: 支援 CI/CD 流程

## 📝 使用建議

### 首次部署
```bash
# 1. 部署資料庫結構
./scripts/deploy-d1-schema.sh

# 2. 部署單字主題關聯
./scripts/deploy-word-themes.sh

# 3. 執行完整部署
./scripts/deploy.sh
```

### 更新單字主題
```bash
# 只更新主題關聯
./scripts/deploy-word-themes.sh
```

### 完整重建
```bash
# 重建整個資料庫
./scripts/deploy-d1-schema.sh
./scripts/deploy-word-themes.sh
```

## ⚠️ 注意事項

1. **備份資料**: 部署前請確保重要資料已備份
2. **權限檢查**: 確保腳本有執行權限 (`chmod +x`)
3. **環境變數**: 確認 `.env.local` 已正確設定
4. **網路連接**: 部署需要穩定的網路連接
5. **Cloudflare 帳戶**: 需要有效的 Cloudflare 帳戶和 D1 資料庫

## 🆘 故障排除

### 常見錯誤
- **權限錯誤**: 執行 `chmod +x scripts/*.sh`
- **配置錯誤**: 檢查 `wrangler-*.toml` 檔案
- **網路錯誤**: 檢查網路連接和 Cloudflare 狀態
- **資料庫錯誤**: 檢查 D1 資料庫狀態和綁定

### 支援
如有問題，請檢查：
1. Cloudflare Workers 儀表板
2. Wrangler 日誌檔案
3. 專案 GitHub Issues
