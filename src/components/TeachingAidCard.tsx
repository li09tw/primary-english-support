'use client';

import { TeachingAid } from '@/types';
import { formatDate } from '@/lib/utils';

interface TeachingAidCardProps {
  aid: TeachingAid;
}

export default function TeachingAidCard({ aid }: TeachingAidCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 border border-pink-100">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{aid.name}</h3>
        <p className="text-gray-600 mb-3">{aid.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <span className="text-sm font-medium text-gray-700">科目：</span>
            <span className="text-sm text-gray-600 ml-2">{aid.subject}</span>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">年級：</span>
            <span className="text-sm text-gray-600 ml-2">{aid.grade}</span>
          </div>
        </div>
        
        {aid.textbookReference && (
          <div className="mb-3">
            <span className="text-sm font-medium text-gray-700">課本參考：</span>
            <span className="text-sm text-gray-600 ml-2">{aid.textbookReference}</span>
          </div>
        )}
        
        {aid.materials.length > 0 && (
          <div className="mb-3">
            <span className="text-sm font-medium text-gray-700">所需材料：</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {aid.materials.map((material, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
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
          <span className="text-sm font-medium text-gray-700">使用說明：</span>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            {aid.instructions.map((instruction, index) => (
              <li key={index} className="text-sm text-gray-600">
                {instruction}
              </li>
            ))}
          </ol>
        </div>
      )}
      
      <div className="text-sm text-gray-500">
        建立時間：{formatDate(aid.createdAt)}
      </div>
    </div>
  );
}
