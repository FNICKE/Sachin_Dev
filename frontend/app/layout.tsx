import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata = {
  title: "Sachin Rathod | Fullstack Developer",
  description: "Professional portfolio of Sachin Rathod — a fullstack developer building modern web applications with Next.js, Node.js, and MySQL.",
  keywords: "Fullstack Developer, Next.js, Node.js, MySQL, React, JavaScript, Portfolio, Sachin",
  openGraph: {
    title: "Sachin Rathod | Fullstack Developer",
    description: "Building pixel-perfect, high-performance web applications.",
    type: "website",
    locale: "en_US",
  },
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} min-h-screen flex flex-col`}
        style={{ background: '#020817', color: '#f8fafc' }}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
