import { NextRequest, NextResponse } from "next/server";
import { getD1Database } from "@/lib/cloudflare";

export async function GET(request: NextRequest) {
  try {
    const db = getD1Database();

    // 獲取所有教材
    const textbooksResult = await db
      .prepare("SELECT * FROM textbooks ORDER BY grade, name")
      .all();

    const textbooks = textbooksResult.results || [];

    // 獲取所有單元
    const unitsResult = await db
      .prepare("SELECT * FROM units ORDER BY textbook_id, name")
      .all();

    const units = unitsResult.results || [];

    // 獲取所有單字
    const vocabularyResult = await db
      .prepare("SELECT * FROM vocabulary ORDER BY unit_id, english")
      .all();

    const vocabulary = vocabularyResult.results || [];

    // 構建完整的數據結構
    const structuredData = textbooks.map((textbook: any) => {
      const textbookUnits = units.filter(
        (unit: any) => unit.textbook_id === textbook.id
      );

      const unitsWithVocabulary = textbookUnits.map((unit: any) => {
        const unitVocabulary = vocabulary.filter(
          (vocab: any) => vocab.unit_id === unit.id
        );

        return {
          id: unit.id,
          name: unit.name,
          vocabulary: unitVocabulary.map((vocab: any) => ({
            id: vocab.id,
            english: vocab.english,
            chinese: vocab.chinese,
            phonetic: vocab.phonetic,
            example: vocab.example,
            image: vocab.image,
          })),
        };
      });

      return {
        id: textbook.id,
        name: textbook.name,
        publisher: textbook.publisher,
        grade: textbook.grade,
        units: unitsWithVocabulary,
      };
    });

    return NextResponse.json({
      success: true,
      data: structuredData,
    });
  } catch (error) {
    console.error("Error fetching textbooks data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch textbooks data",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
