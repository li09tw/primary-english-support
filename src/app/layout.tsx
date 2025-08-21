import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PrimaryEnglishSupport - 英語教學輔具平台',
  description: '為資源不足的學校提供數位化教學工具，讓每個孩子都能享受優質的英語學習體驗。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
