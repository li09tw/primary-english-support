"use client";

import useSWR from "swr";

export interface ThemeWord {
  id: number;
  english_singular: string;
  english_plural?: string;
  chinese_meaning: string;
  part_of_speech: string;
}

const fetcher = async (url: string): Promise<ThemeWord[]> => {
  const res = await fetch(url, { next: { revalidate: 900 } });
  if (!res.ok) throw new Error("Failed to fetch theme words");
  const data = await res.json();
  return data.data || [];
};

export function useThemeWords(themeIds: number[], partOfSpeech?: string) {
  const key = themeIds.length
    ? `/api/learning-content?action=words_by_theme&theme_id=${themeIds.join(
        ","
      )}${partOfSpeech ? `&part_of_speech=${partOfSpeech}` : ""}`
    : null;

  // 若傳多個主題，逐一請求後合併（並去重）
  const { data, error, isLoading } = useSWR<ThemeWord[] | null>(
    key,
    async () => {
      const results: ThemeWord[] = [];
      for (const id of themeIds) {
        const url = `/api/learning-content?action=words_by_theme&theme_id=${id}${
          partOfSpeech ? `&part_of_speech=${partOfSpeech}` : ""
        }`;
        const words = await fetcher(url.replace("$", ""));
        results.push(...words);
      }
      const unique = new Map<number, ThemeWord>();
      results.forEach((w) => unique.set(w.id, w));
      return Array.from(unique.values());
    }
  );

  return {
    words: data || [],
    isLoading,
    error,
  };
}
