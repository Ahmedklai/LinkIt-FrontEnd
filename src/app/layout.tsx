import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Header } from "@/components/layout/Header";
import { ThemeProvider } from "@/components/Providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LinkIt - URL Shortener",
  description: "Shorten your long URLs efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="min-h-screen  text-gray-900 dark:text-gray-100 transition-colors">
            <ThemeToggle />
            <Header />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
