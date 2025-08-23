"use client";

export default function TermsPage() {
  const currentDate = new Date().toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-black mb-8 text-center">
            服務條款
          </h1>

          <div className="text-center mb-8">
            <p className="text-lg text-[#2b6b7a]">生效日期：{currentDate}</p>
          </div>

          <div className="space-y-6 text-gray-800">
            <p>
              歡迎您使用Zs Primary English Support /
              Z的國小英語支援網站（以下簡稱「本網站」）。在您開始使用本網站提供的服務前，請詳細閱讀以下服務條款（以下簡稱「本條款」）。您對本網站的存取和使用，即表示您已閱讀、理解並同意接受本條款的所有內容。如果您不同意本條款的任何部分，請立即停止使用本網站。
            </p>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                一、服務說明
              </h2>
              <p>
                本網站是一個提供英語教學輔具、遊戲方法和教學資源的平台，專為國小英語教學設計。所有內容僅供教學參考使用，不構成任何專業教學建議或保證。使用者應根據實際教學需求和學生程度進行適當調整。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                二、使用者行為與責任
              </h2>
              <p>
                您同意不將本網站用於任何非法或本條款禁止之目的。您在使用本網站時，必須遵守當地相關法律法規，並承諾不得從事以下行為：
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  試圖以任何方式探測、掃描或測試本網站系統或網路的弱點，或破壞安全措施。
                </li>
                <li>
                  對本網站的內容進行未經授權的複製、修改、散佈、出售或進行任何商業性利用。
                </li>
                <li>
                  使用任何自動化設備（如爬蟲、機器人）來存取、抓取本網站的資料。
                </li>
                <li>
                  上傳或散佈任何含有病毒、惡意軟體或可能損害他人電腦系統的檔案。
                </li>
                <li>干擾或中斷本網站的正常運作。</li>
                <li>將本網站的教學資源用於非教育目的。</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                三、智慧財產權與內容來源
              </h2>
              <p>
                本網站上所有內容，包括但不限於文字、圖片、圖表、標誌、軟體等，其智慧財產權均歸英語教學輔具平台或其合法權利人所有。未經我們或權利人事先書面同意，您不得以任何方式使用這些內容。
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                <p className="text-yellow-800 font-medium">
                  <strong>重要聲明：</strong>
                  本網站上的許多教學內容、遊戲方法和輔具資源是透過人工智慧（AI）技術生成或整理而來，並非由本站原創或持有。這些AI生成內容僅供教學參考使用，使用者應自行評估其適用性和準確性。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                四、第三方連結與廣告
              </h2>
              <p>
                本網站可能包含指向第三方網站的連結或顯示由第三方（如 Google
                AdSense）提供的廣告。這些連結和廣告僅為方便使用者而提供。我們對這些第三方網站或廣告的內容、準確性及隱私權措施概不負責。您因使用或信賴任何此類第三方內容、商品或服務所造成的任何損害或損失，本網站不承擔任何責任。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                五、免責聲明
              </h2>
              <p>
                本網站所有內容均按「現況」及「現有」基礎提供。我們不對內容的準確性、完整性、即時性或可靠性作任何明示或暗示的保證。
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  我們不保證本網站服務將不間斷或無錯誤，也不保證任何缺陷將被修正。
                </li>
                <li>
                  您同意自行承擔使用本網站的所有風險。對於因使用或無法使用本網站而導致的任何直接、間接、附帶或衍生的損害，本網站概不負責。
                </li>
                <li>
                  AI生成內容的品質和適用性可能因技術限制而有所差異，使用者應謹慎評估並根據實際情況調整使用方式。
                </li>
                <li>
                  本網站提供的教學資源和方法僅供參考，實際教學效果可能因學生程度、教學環境等因素而有所不同。
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                六、服務的變更與終止
              </h2>
              <p>
                我們保留隨時修改、暫停或永久終止本網站服務的權利，恕不另行通知。對於服務的任何修改、暫停或終止，我們對您或任何第三方均不承擔責任。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                七、條款的修訂
              </h2>
              <p>
                我們有權隨時修訂本條款，修訂後的條款將公佈於本網站上，並自公佈之日起生效。如果您在條款修訂後繼續使用本網站，即視為您已接受該等修訂。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                八、準據法與管轄權
              </h2>
              <p>
                本條款的解釋與適用，以及與本條款有關的爭議，均應依照中華民國法律予以處理。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                九、聯絡我們
              </h2>
              <p className="text-gray-700 mb-4">
                如果您對本服務條款有任何疑問，請透過{" "}
                <a href="/contact" className="text-[#2b6b7a] hover:underline">
                  聯絡表單
                </a>{" "}
                聯繫。
              </p>
            </section>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                最後更新時間：{currentDate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
