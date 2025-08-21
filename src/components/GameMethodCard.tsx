'use client';

import { GameMethod } from '@/types';
import { formatDate } from '@/lib/utils';

interface GameMethodCardProps {
  game: GameMethod;
}

export default function GameMethodCard({ game }: GameMethodCardProps) {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    hard: 'bg-red-100 text-red-800 border-red-200',
  };

  const difficultyText = {
    easy: '簡單',
    medium: '中等',
    hard: '困難',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 border border-pink-100">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{game.title}</h3>
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full border ${difficultyColors[game.difficulty]}`}
        >
          {difficultyText[game.difficulty]}
        </span>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-600 mb-3">{game.description}</p>
        
        <div className="mb-3">
          <span className="text-sm font-medium text-gray-700">分類：</span>
          <span className="text-sm text-gray-600">{game.category}</span>
        </div>
        
        {game.materials.length > 0 && (
          <div className="mb-3">
            <span className="text-sm font-medium text-gray-700">所需材料：</span>
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
          <span className="text-sm font-medium text-gray-700">遊戲步驟：</span>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            {game.instructions.map((instruction, index) => (
              <li key={index} className="text-sm text-gray-600">
                {instruction}
              </li>
            ))}
          </ol>
        </div>
      )}
      
      <div className="text-sm text-gray-500">
        建立時間：{formatDate(game.createdAt)}
      </div>
    </div>
  );
}
