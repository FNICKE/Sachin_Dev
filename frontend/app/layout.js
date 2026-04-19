import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CursorFollower from "@/components/CursorFollower";
import FloatingObjects from "@/components/FloatingObjects";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata = {
  title: "Sachin Rathod | Fullstack Developer",
  description: "Portfolio of Sachin Rathod — Fullstack Developer building pixel-perfect, high-performance web apps with React, Node.js & more.",
  keywords: "Fullstack Developer, Next.js, Node.js, MySQL, React, JavaScript, Portfolio, Sachin Rathod",
  openGraph: {
    title: "Sachin Rathod | Fullstack Developer",
    description: "Building digital experiences that blend innovation with pixel-perfect design.",
    type: "website",
    locale: "en_US",
    url: "https://yourportfolio.com",
    siteName: "Sachin Rathod Portfolio",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} antialiased min-h-screen flex flex-col`}
        style={{ background: '#020817', color: '#f8fafc' }}>

        {/* Dynamic color-shifting background */}
        <div className="dynamic-bg" />

        {/* Aurora animated background */}
        <div className="aurora" />

        {/* Grid overlay */}
        <div className="fixed inset-0 bg-grid opacity-100 pointer-events-none -z-10" />

        {/* Floating geometric objects & stars */}
        <FloatingObjects />

        {/* Custom cat cursor */}
        <CursorFollower />

        <Navbar />
        <main className="flex-grow relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
