"use client";

import { GameMethod } from "@/types";
import { formatDate } from "@/lib/utils";

interface GameMethodCardProps {
  game: GameMethod;
}

export default function GameMethodCard({ game }: GameMethodCardProps) {
  const gradeColors = {
    grade1: "bg-green-100 text-green-800 border-green-200",
    grade2: "bg-blue-100 text-blue-800 border-blue-200",
    grade3: "bg-yellow-100 text-yellow-800 border-yellow-200",
    grade4: "bg-purple-100 text-purple-800 border-purple-200",
    grade5: "bg-pink-100 text-pink-800 border-pink-200",
    grade6: "bg-red-100 text-red-800 border-red-200",
  };

  const gradeText = {
    grade1: "1年級",
    grade2: "2年級",
    grade3: "3年級",
    grade4: "4年級",
    grade5: "5年級",
    grade6: "6年級",
  };

  // 從布林值年級欄位生成 grades 陣列
  const getGradesArray = () => {
    const grades: string[] = [];
    if (game.grade1) grades.push("grade1");
    if (game.grade2) grades.push("grade2");
    if (game.grade3) grades.push("grade3");
    if (game.grade4) grades.push("grade4");
    if (game.grade5) grades.push("grade5");
    if (game.grade6) grades.push("grade6");
    return grades;
  };

  const grades = getGradesArray();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 border border-pink-100">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-black">{game.title}</h3>
        <div className="flex flex-wrap gap-1">
          {grades.map((grade) => (
            <span
              key={grade}
              className={`px-2 py-1 text-xs font-medium rounded-full border ${
                gradeColors[grade as keyof typeof gradeColors]
              }`}
            >
              {gradeText[grade as keyof typeof gradeText]}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-black mb-3">{game.description}</p>

        <div className="mb-3">
          <span className="text-sm font-medium text-black">分類：</span>
          <span className="text-sm text-black">
            {game.categories.join(", ")}
          </span>
        </div>

        {game.materials.length > 0 && (
          <div className="mb-3">
            <span className="text-sm font-medium text-black">所需材料：</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {game.materials.map((material, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full"
                >
                  {material}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {game.instructions.length > 0 && (
        <div className="mb-4">
          <span className="text-sm font-medium text-black">遊戲步驟：</span>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            {game.instructions.map((instruction, index) => (
              <li key={index} className="text-sm text-black">
                {instruction}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="text-sm text-black">
        建立時間：{formatDate(game.createdAt)}
      </div>
    </div>
  );
}
