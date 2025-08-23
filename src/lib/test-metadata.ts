// 測試 metadata 配置的腳本
// 這個文件可以用來驗證 metadata 配置是否正確

import { generateMetadata, pageMetadata } from "./metadata";

// 測試所有頁面的 metadata 生成
export function testAllMetadata() {
  const pageKeys = Object.keys(pageMetadata) as Array<
    keyof typeof pageMetadata
  >;

  console.log("=== 測試所有頁面的 Metadata 配置 ===");

  pageKeys.forEach((key) => {
    try {
      const metadata = generateMetadata(key);
      console.log(`✅ ${key}: 配置成功`);
      console.log(`   標題: ${metadata.title}`);
      console.log(`   描述: ${metadata.description}`);
      console.log(`   關鍵字數量: ${metadata.keywords?.length || 0}`);
      console.log(`   OpenGraph URL: ${metadata.openGraph?.url}`);
      console.log("---");
    } catch (error) {
      console.error(`❌ ${key}: 配置失敗`, error);
    }
  });

  console.log("=== 測試完成 ===");
}

// 測試特定頁面的 metadata
export function testSpecificMetadata(pageKey: keyof typeof pageMetadata) {
  try {
    const metadata = generateMetadata(pageKey);
    console.log(`=== ${pageKey} 頁面的 Metadata ===`);
    console.log("完整配置:", JSON.stringify(metadata, null, 2));
    return metadata;
  } catch (error) {
    console.error(`❌ ${pageKey}: 配置失敗`, error);
    return null;
  }
}

// 驗證 metadata 的必要字段
export function validateMetadata(metadata: any) {
  const requiredFields = ["title", "description", "keywords", "openGraph"];
  const missingFields: string[] = [];

  requiredFields.forEach((field) => {
    if (!metadata[field]) {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    console.error(`❌ 缺少必要字段: ${missingFields.join(", ")}`);
    return false;
  }

  console.log("✅ 所有必要字段都存在");
  return true;
}

// 如果直接運行此文件，執行測試
if (typeof window === "undefined") {
  // 在 Node.js 環境中運行
  testAllMetadata();
}
