"use client";

export default function TestHeaderPage() {
  return (
    <div className="min-h-screen bg-primary-blue">
      {/* 添加頂部間距，避免與 Header 重疊 */}
      <div className="pt-16"></div>

      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              Header 點擊測試頁面
            </h1>
            <p className="text-lg text-white/80">
              這個頁面用於測試 Header 導航是否正常工作
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              測試說明
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>• 請嘗試點擊頁面頂部的 Header 導航連結</p>
              <p>• 應該能夠正常跳轉到其他頁面</p>
              <p>• 如果無法點擊，可能是樣式或 z-index 問題</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              頁面樣式
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>• 背景色：bg-primary-blue</p>
              <p>• 頂部間距：pt-16</p>
              <p>• Header z-index：z-50</p>
              <p>• 導航連結 z-index：z-10</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
