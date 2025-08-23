import Head from "next/head";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export default function SEOHead({
  title = "Z的國小英語支援(ZPES) - 英語教學輔具平台",
  description = "為資源不足的學校提供數位化教學工具，讓每個孩子都能享受優質的英語學習體驗。",
  keywords = [
    "英語教學",
    "教學輔具",
    "英語遊戲",
    "小學英語",
    "數位教學",
    "英語學習",
  ],
  image = "/og-image.jpg",
  url = "https://zsprimaryenglishsupport.com",
  type = "website",
  publishedTime,
  modifiedTime,
  author = "Z的國小英語支援(ZPES) Team",
  section,
  tags = [],
}: SEOHeadProps) {
  const fullTitle = title.includes("Z的國小英語支援(ZPES)")
    ? title
    : `${title} | Z的國小英語支援(ZPES)`;

  return (
    <Head>
      {/* 基本 Meta 標籤 */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <meta name="author" content={author} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Z的國小英語支援(ZPES)" />
      <meta property="og:locale" content="zh_TW" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* 文章相關 Meta 標籤 */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}
      {type === "article" && section && (
        <meta property="article:section" content={section} />
      )}
      {type === "article" && tags.length > 0 && (
        <meta property="article:tag" content={tags.join(", ")} />
      )}

      {/* 其他重要 Meta 標籤 */}
      <meta name="robots" content="index, follow" />
      <meta
        name="googlebot"
        content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
      />
      <link rel="canonical" href={url} />
    </Head>
  );
}
