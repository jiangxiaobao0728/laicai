import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "测测你的天生来财方式",
  description: "通过20道题目，发现你最适合自己的赚钱方式",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
