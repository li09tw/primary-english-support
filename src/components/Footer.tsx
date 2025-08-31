export default function Footer() {
  return (
    <footer className="bg-white mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-8">
          <a
            href="/contact"
            className="text-black hover:text-primary-blue transition-colors duration-200 font-medium"
          >
            聯絡我們
          </a>
          <a
            href="/privacy"
            className="text-black hover:text-primary-blue transition-colors duration-200 font-medium"
          >
            隱私權條款
          </a>
          <a
            href="/terms"
            className="text-black hover:text-primary-blue transition-colors duration-200 font-medium"
          >
            服務條款
          </a>
          <a
            href="https://portaly.cc/zoralitw009/support"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-primary-blue transition-colors duration-200 font-medium"
          >
            請我喝杯咖啡
          </a>
        </div>
      </div>
    </footer>
  );
}
