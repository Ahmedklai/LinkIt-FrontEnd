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
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
    other: {
      rel: "mask-icon",
      url: "/logo.svg",
      color: "#000000",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={"../assets/logo.svg"} type="image/svg+xml" />
      </head>
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
