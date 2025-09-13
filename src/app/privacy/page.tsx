import { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata("privacy");

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">隱私權政策</h1>
          <p className="text-lg text-black">生效日期：2025年8月1日</p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <p className="text-black mb-6">
              歡迎您使用
              Z的國小英語支援（ZPES）（以下簡稱「本網站」）。我們非常重視您的隱私權，因此制定了本隱私權政策，以說明我們如何收集、使用、保護您的資訊。當您使用本網站時，即表示您同意本政策的內容。
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-black mb-4">
                一、我們收集的資訊
              </h2>
              <p className="text-black mb-4">
                本網站不要求使用者註冊或登入，因此我們不會主動收集您的姓名、電子郵件地址等個人身份識別資訊。我們收集的資訊主要來自於您與本網站互動時自動產生的非個人識別資訊：
              </p>
              <ul className="list-disc pl-6 text-black space-y-2">
                <li>
                  <strong>日誌檔案 (Log Files)：</strong>
                  如同大多數網站，我們會收集伺服器日誌檔案中的資訊，例如您的 IP
                  位址（可能用於推斷地理位置）、瀏覽器類型、作業系統、網路服務供應商
                  (ISP)、訪問日期與時間、以及您在本網站上瀏覽的頁面。
                </li>
                <li>
                  <strong>Cookie 及類似技術：</strong>
                  本網站透過第三方服務（Google Analytics 與 Google AdSense）使用
                  Cookie 來提升您的使用體驗並分析網站流量。Cookie
                  是儲存在您電腦上的小型文本檔案。
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-black mb-4">
                二、我們如何使用資訊
              </h2>
              <p className="text-black mb-4">我們使用收集到的資訊來：</p>
              <ul className="list-disc pl-6 text-black space-y-2">
                <li>
                  <strong>分析網站流量與使用者行為：</strong>透過 Google
                  Analytics，我們分析匿名的、匯總的數據，以了解使用者如何與本網站互動（例如哪些頁面最受歡迎、使用者停留時間等），從而優化網站內容和使用者體驗。
                </li>
                <li>
                  <strong>提供個人化廣告：</strong>本網站使用 Google AdSense
                  來顯示廣告。Google 及其合作夥伴可能會使用 Cookie（例如
                  DoubleClick DART
                  Cookie）根據您對本網站及網路上其他網站的造訪紀錄，來投放您可能感興趣的廣告。
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-black mb-4">
                三、第三方服務
              </h2>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-primary-blue-dark mb-3">
                  Google Analytics：
                </h3>
                <ul className="list-disc pl-6 text-black space-y-2">
                  <li>
                    本網站使用 Google Analytics 來分析網站使用情況。Google
                    Analytics 會收集關於您的非個人識別資訊，並將其傳輸至 Google
                    的伺服器。
                  </li>
                  <li>我們已啟用 IP 匿名化功能，以保護您的隱私。</li>
                  <li>
                    如果您想停用 Google Analytics 的追蹤，可以安裝「Google
                    Analytics Opt-out Browser Add-on」。
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-primary-blue-dark mb-3">
                  Google AdSense：
                </h3>
                <ul className="list-disc pl-6 text-black space-y-2">
                  <li>
                    第三方供應商（包括 Google）會使用 Cookie
                    來放送您先前瀏覽過的網站相關廣告。
                  </li>
                  <li>
                    Google 使用廣告 Cookie，可讓 Google
                    及其合作夥伴根據您在本網站或其他網站上的瀏覽記錄來放送廣告。
                  </li>
                  <li>
                    您可以前往「Google 廣告設定」頁面 (
                    <a
                      href="https://www.google.com/settings/ads"
                      className="text-primary-blue-dark hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://www.google.com/settings/ads
                    </a>
                    )，選擇停用個人化廣告。您也可以前往{" "}
                    <a
                      href="https://www.aboutads.info"
                      className="text-primary-blue-dark hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      www.aboutads.info
                    </a>{" "}
                    網站，選擇停用部分第三方供應商的 Cookie。
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-black mb-4">
                四、您的選擇與權利
              </h2>
              <p className="text-black">
                您可以透過瀏覽器設定來管理或刪除 Cookie。請注意，停用 Cookie
                可能會影響您在本網站上的部分功能體驗。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-black mb-4">
                五、外部連結
              </h2>
              <p className="text-black">
                本網站可能包含連至其他網站的連結。請注意，我們無法對這些外部網站的隱私權措施負責。當您離開本網站時，建議您閱讀該網站的隱私權聲明。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-black mb-4">
                六、兒童隱私
              </h2>
              <p className="text-black">
                本網站無意收集未滿 13
                歲（或您所在地區規定的年齡）兒童的個人資訊。如果我們發現無意中收集了此類資訊，將會立即刪除。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-black mb-4">
                七、隱私權政策的修訂
              </h2>
              <p className="text-black">
                我們可能會不時修訂本隱私權政策。任何變更將會在此頁面上公佈，並更新頁首的「生效日期」。我們建議您定期查看本政策，以了解最新的隱私權措施。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-black mb-4">
                八、聯絡我們
              </h2>
              <p className="text-black mb-4">
                如果您對本隱私權政策有任何疑問， 請透過{" "}
                <a
                  href="/contact"
                  className="text-primary-blue-dark hover:underline"
                >
                  聯絡表單
                </a>{" "}
                聯繫。
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
