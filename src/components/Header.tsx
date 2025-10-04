"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "首頁", href: "/" },
    { name: "遊戲庫", href: "/games" },
    { name: "電子教具", href: "/aids" },
    { name: "Wordwall/Kahoot", href: "/public-games", invisible: true },
    {
      name: "請我喝杯咖啡",
      href: "https://portaly.cc/zoralitw009/support",
      external: true,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-black">
                白板英語遊戲室
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation
              .filter((item) => !item.invisible)
              .map((item) =>
                item.external ? (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black hover:text-primary-blue hover:bg-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative z-10"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-black hover:text-primary-blue hover:bg-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative z-10"
                  >
                    {item.name}
                  </Link>
                )
              )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-black hover:text-primary-blue focus:outline-none focus:text-primary-blue relative z-10"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3  space-y-1 sm:px-3 bg-white border border-gray-200 rounded-lg mt-2 mb-3 shadow-lg">
              {navigation
                .filter((item) => !item.invisible)
                .map((item) =>
                  item.external ? (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-center text-black hover:text-black hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-center text-black hover:text-black hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
