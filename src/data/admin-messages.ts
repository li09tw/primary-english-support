import { AdminMessage } from "@/types";

// 站長消息數據 - 直接嵌入組件中提升載入速度
export const ADMIN_MESSAGES: AdminMessage[] = [
  {
    id: "4",
    title: "歡迎來到ZPES！",
    content:
      "本站於2025年成立，不定時更新遊戲庫裡面的遊戲方法。電子教具目前有6種，每一個月會完成一種，下一次策劃會是 2026年的暑假。\n過段時日會於網站下方和兩側置入廣告，也歡迎大家透過「請我喝杯咖啡」抖內這個網站唷！",
    is_published: true,
    is_pinned: true,
    createdAt: new Date("2025-08-31T14:10:06"),
    updatedAt: new Date("2025-08-31T15:21:25"),
  },
  {
    id: "5",
    title: "句型拉霸機",
    content:
      "句型拉霸機已經可以使用囉！歡迎老師查看是否有自己需要的句型遊戲在裡面。",
    is_published: true,
    is_pinned: false,
    createdAt: new Date("2025-08-31T14:11:33"),
    updatedAt: new Date("2025-09-20T14:11:33"),
  },
];

// 獲取已發布的消息
export function getPublishedMessages(): AdminMessage[] {
  return ADMIN_MESSAGES.filter((msg) => msg.is_published);
}

// 獲取置頂的消息
export function getPinnedMessages(): AdminMessage[] {
  return ADMIN_MESSAGES.filter((msg) => msg.is_published && msg.is_pinned);
}
