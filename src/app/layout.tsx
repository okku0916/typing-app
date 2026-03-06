import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const uiFont = Space_Grotesk({
  variable: "--font-ui",
  subsets: ["latin"],
});

const codeFont = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeTyping",
  description: "Programming-focused typing trainer for developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${uiFont.variable} ${codeFont.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
