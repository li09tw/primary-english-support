import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 頁面標題 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">聯絡我們</h1>
          <p className="text-xl text-gray-600">
            如果您有任何問題、建議或需要協助，歡迎與我們聯繫
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 聯絡表單 */}
          <div>
            <ContactForm />
          </div>

          {/* 聯絡資訊 */}
          <div className="space-y-8">
            {/* 關於我們 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                關於我們
              </h3>
              <p className="text-gray-600 mb-4">
                PrimaryEnglishSupport
                致力於為資源不足的學校提供高品質的英語教學工具。
                我們相信每個孩子都應該有機會享受優質的英語學習體驗。
              </p>
              <p className="text-gray-600">
                透過數位化技術，我們將傳統的紙本和塑膠教具轉化為互動式的電子工具，
                讓教學更加生動有趣，學習效果更加顯著。
              </p>
            </div>

            {/* 服務時間 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                服務時間
              </h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>週一至週五</span>
                  <span>09:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>週六</span>
                  <span>10:00 - 16:00</span>
                </div>
                <div className="flex justify-between">
                  <span>週日</span>
                  <span>休息</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                * 國定假日服務時間可能有所調整
              </p>
            </div>

            {/* 常見問題 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                常見問題
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    如何新增遊戲方法？
                  </h4>
                  <p className="text-sm text-gray-600">
                    您可以透過管理介面新增遊戲方法，包括遊戲說明、所需材料和操作步驟等資訊。
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    可以自訂教學輔具嗎？
                  </h4>
                  <p className="text-sm text-gray-600">
                    是的，您可以根據課本內容和教學需求，自訂適合的教學輔具。
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    如何發布站長消息？
                  </h4>
                  <p className="text-sm text-gray-600">
                    在管理介面中，您可以撰寫和發布站長消息，讓使用者了解最新的更新和重要資訊。
                  </p>
                </div>
              </div>
            </div>

            {/* 技術支援 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                技術支援
              </h3>
              <p className="text-gray-600 mb-4">
                如果您在使用過程中遇到技術問題，請詳細描述問題情況，我們會盡快協助您解決。
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>提示：</strong>{" "}
                  請提供您的作業系統版本、瀏覽器類型和版本，以及問題發生的具體步驟，
                  這樣我們能更快地為您提供解決方案。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
