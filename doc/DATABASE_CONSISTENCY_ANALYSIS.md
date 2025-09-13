# 虛擬資料庫與 D1 資料庫一致性分析報告

## 檢查時間
2025/9/13 下午4:48:41

## 執行摘要

- **總主題數**: 24
- **總單字數**: 823
- **單字數量 ≥ 10 的主題**: 18 個
- **單字數量 < 10 的主題**: 6 個

## 所有主題單字數量統計

| 排名 | 主題ID | 主題名稱 | 單字數量 | 狀態 |
|------|--------|----------|----------|------|
| 1 | 11 | Ailments | 100 | ✅ 充足 |
| 2 | 12 | Countries | 100 | ✅ 充足 |
| 3 | 23 | Numbers | 100 | ✅ 充足 |
| 4 | 24 | Time Expressions | 72 | ✅ 充足 |
| 5 | 5 | Fruits | 50 | ✅ 充足 |
| 6 | 10 | School Subjects | 50 | ✅ 充足 |
| 7 | 13 | Furniture | 50 | ✅ 充足 |
| 8 | 16 | Main Dishes | 50 | ✅ 充足 |
| 9 | 4 | Stationery | 40 | ✅ 充足 |
| 10 | 3 | Sports | 30 | ✅ 充足 |
| 11 | 15 | Drinks | 30 | ✅ 充足 |
| 12 | 19 | Professions | 25 | ✅ 充足 |
| 13 | 22 | Buildings & Places | 20 | ✅ 充足 |
| 14 | 20 | Daily Actions | 18 | ✅ 充足 |
| 15 | 21 | Clothing | 16 | ✅ 充足 |
| 16 | 9 | Months | 12 | ✅ 充足 |
| 17 | 2 | Colors | 11 | ✅ 充足 |
| 18 | 18 | Identity | 11 | ✅ 充足 |
| 19 | 1 | Emotions | 8 | ⚠️ 不足 |
| 20 | 8 | Days of Week | 7 | ⚠️ 不足 |
| 21 | 6 | Fast Food | 6 | ⚠️ 不足 |
| 22 | 7 | Bakery & Snacks | 6 | ⚠️ 不足 |
| 23 | 14 | Toys | 6 | ⚠️ 不足 |
| 24 | 17 | Bubble Tea Toppings | 5 | ⚠️ 不足 |

## 單字數量小於 10 個的主題詳細分析

⚠️ 以下主題的單字數量不足，需要擴充：

### Emotions (主題ID: 1)
- **目前單字數量**: 8
- **需要增加**: 2 個單字
- **建議擴充方向**:
  - 正面情緒：joyful, cheerful, delighted, proud, confident, optimistic, grateful, peaceful
  - 負面情緒：worried, nervous, frustrated, disappointed, lonely, anxious, stressed, confused
  - 中性情緒：calm, serious, focused, determined, curious, surprised, confused

### Fast Food (主題ID: 6)
- **目前單字數量**: 6
- **需要增加**: 4 個單字
- **建議擴充方向**:
  - 漢堡類：cheeseburger, chicken burger, fish burger, veggie burger
  - 飲料類：milkshake, iced tea, coffee, smoothie
  - 配菜類：onion rings, chicken wings, salad, fries, nuggets
  - 其他：sandwich, wrap, taco, burrito

### Bakery & Snacks (主題ID: 7)
- **目前單字數量**: 6
- **需要增加**: 4 個單字
- **建議擴充方向**:
  - 麵包類：croissant, bagel, muffin, toast, roll, bun
  - 甜點類：cupcake, brownie, ice cream, chocolate, candy, lollipop
  - 餅乾類：cracker, biscuit, wafer, pretzel
  - 其他：popcorn, chips, nuts, seeds

### Days of Week (主題ID: 8)
- **目前單字數量**: 7
- **需要增加**: 3 個單字
- **建議擴充方向**:
  - 時間段：weekend, weekday, today, yesterday, tomorrow
  - 時間表達：morning, afternoon, evening, night, dawn, dusk
  - 其他：holiday, vacation, birthday, anniversary

### Toys (主題ID: 14)
- **目前單字數量**: 6
- **需要增加**: 4 個單字
- **建議擴充方向**:
  - 傳統玩具：blocks, train, airplane, boat, kite, yo-yo, jump rope
  - 電子玩具：video game, tablet, smartphone, computer, robot
  - 戶外玩具：bicycle, scooter, skateboard, frisbee
  - 其他：puppet, magic set, board game, card game

### Bubble Tea Toppings (主題ID: 17)
- **目前單字數量**: 5
- **需要增加**: 5 個單字
- **建議擴充方向**:
  - 珍珠類：boba, tapioca, sago, crystal boba
  - 果凍類：coconut jelly, grass jelly, aloe vera, konjac
  - 其他：milk foam, brown sugar, honey, syrup, ice cream

## 資料庫一致性結論

⚠️ **虛擬資料庫與 D1 資料庫存在差異**
- 6 個主題的單字數量不足
- 建議優先處理單字數量最少的主題
- 可以考慮從其他主題借用相關單字

## 建議的處理優先順序

根據單字數量從少到多排序：

1. **Bubble Tea Toppings** - 目前 5 個單字，需要增加 5 個
2. **Fast Food** - 目前 6 個單字，需要增加 4 個
3. **Bakery & Snacks** - 目前 6 個單字，需要增加 4 個
4. **Toys** - 目前 6 個單字，需要增加 4 個
5. **Days of Week** - 目前 7 個單字，需要增加 3 個
6. **Emotions** - 目前 8 個單字，需要增加 2 個