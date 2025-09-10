import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata("contact");

export default function ContactPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 頁面標題 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">聯絡我們</h1>
          <p className="text-xl text-black">
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

            {/* 意見回饋 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                意見回饋
              </h3>
              <p className="text-gray-600">
                歡迎提供對網站內容、互動設計與學習體驗的建議，我們會持續改進。
              </p>
            </div>

            {/* 遊戲、輔具提議 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                遊戲、輔具提議
              </h3>
              <p className="text-gray-600 mb-4">
                請描述教材、年級、句型/單字，以及希望增加或投放的電子教具。
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>建議格式：</strong>{" "}
                  教材／年級／句型或單字／教具說明與使用方式。
                </p>
              </div>
            </div>

            {/* 其他 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">其他</h3>
              <p className="text-gray-600">
                若上述項目不符合您的需求，請在表單中選擇「其他」並說明。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
