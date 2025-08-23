export default function Footer() {
  return (
    <footer className="bg-white mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-8">
          <a
            href="/contact"
            className="text-gray-800 hover:text-primary-blue transition-colors duration-200 font-medium"
          >
            聯絡我們
          </a>
          <a
            href="/privacy"
            className="text-gray-800 hover:text-primary-blue transition-colors duration-200 font-medium"
          >
            隱私權條款
          </a>
          <a
            href="/terms"
            className="text-gray-800 hover:text-primary-blue transition-colors duration-200 font-medium"
          >
            服務條款
          </a>
        </div>
      </div>
    </footer>
  );
}
