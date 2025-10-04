import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-blue">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-black mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-black mb-4">頁面未找到</h2>
        <p className="text-black mb-8">抱歉，您訪問的頁面不存在。</p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-secondary-pink text-black font-medium rounded-lg hover:bg-white hover:text-primary-blue transition-colors"
        >
          返回首頁
        </Link>
      </div>
    </div>
  );
}
