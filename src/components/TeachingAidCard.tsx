"use client";

import { TeachingAid } from "@/types";
import { formatDate } from "@/lib/utils";

interface TeachingAidCardProps {
  aid: TeachingAid;
}

export default function TeachingAidCard({ aid }: TeachingAidCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 border border-secondary-pink">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-black mb-2">{aid.name}</h3>
        <p className="text-black mb-3">{aid.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <span className="text-sm font-medium text-black">科目：</span>
            <span className="text-sm text-black ml-2">{aid.subject}</span>
          </div>
          <div>
            <span className="text-sm font-medium text-black">年級：</span>
            <span className="text-sm text-black ml-2">
              {aid.grade === "grade1"
                ? "1年級"
                : aid.grade === "grade2"
                ? "2年級"
                : aid.grade === "grade3"
                ? "3年級"
                : aid.grade === "grade4"
                ? "4年級"
                : aid.grade === "grade5"
                ? "5年級"
                : aid.grade === "grade6"
                ? "6年級"
                : aid.grade}
            </span>
          </div>
        </div>

        {aid.textbookReference && (
          <div className="mb-3">
            <span className="text-sm font-medium text-black">課本參考：</span>
            <span className="text-sm text-black ml-2">
              {aid.textbookReference}
            </span>
          </div>
        )}

        {aid.materials.length > 0 && (
          <div className="mb-3">
            <span className="text-sm font-medium text-black">所需材料：</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {aid.materials.map((material, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-secondary-pink text-black text-xs rounded-full"
                >
                  {material}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {aid.instructions.length > 0 && (
        <div className="mb-4">
          <span className="text-sm font-medium text-black">使用說明：</span>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            {aid.instructions.map((instruction, index) => (
              <li key={index} className="text-sm text-black">
                {instruction}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="text-sm text-black">
        建立時間：{formatDate(aid.createdAt)}
      </div>
    </div>
  );
}
