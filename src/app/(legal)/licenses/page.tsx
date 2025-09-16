import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "版權聲明",
  description: "本站使用之第三方資源的版權與授權說明",
};

export default function LicensesPage() {
  return (
    <div className="min-h-screen py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
            版權聲明
          </h1>
          <p className="text-base text-black">
            以下為本網站所使用之第三方資源與其授權條款連結。
          </p>
        </header>

        <ul className="space-y-4">
          <li className="border border-gray-200 rounded-md p-4 hover:bg-white transition-colors">
            <a href="/licenses/lucide" className="block">
              <div className="flex items-center justify-between">
                <div>
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: "#2b6b7a" }}
                  >
                    Lucide Icons
                  </h2>
                  <p className="text-black text-sm">
                    Icon set derived from Feather; licensed under ISC and MIT
                    (for portions derived from Feather).
                  </p>
                </div>
                <span className="text-black text-sm">查看授權內容 →</span>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
