export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-rose-300 via-pink-300 to-purple-300 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 專案資訊 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">PrimaryEnglishSupport</h3>
            <p className="text-gray-700 text-sm">
              為資源不足的學校提供數位化教學工具，讓每個孩子都能享受優質的英語學習體驗。
            </p>
          </div>

          {/* 快速連結 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">快速連結</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/games" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">
                  遊戲方法
                </a>
              </li>
              <li>
                <a href="/aids" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">
                  教學輔具
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">
                  聯絡我們
                </a>
              </li>
            </ul>
          </div>

          {/* 聯絡資訊 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">聯絡資訊</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p>如有任何問題或建議，歡迎與我們聯絡。</p>
              <p>我們會盡快回覆您的訊息。</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-pink-200">
          <div className="text-center text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} PrimaryEnglishSupport. 保留所有權利。</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
