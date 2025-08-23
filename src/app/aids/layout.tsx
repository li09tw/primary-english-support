export default function AidsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* 添加頂部間距，避免與 Header 重疊 */}

      {children}
    </div>
  );
}
