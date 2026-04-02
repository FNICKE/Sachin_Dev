import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata = {
  title: "Professional Portfolio | Fullstack Developer",
  description: "Explore the professional portfolio of a dedicated fullstack developer specializing in Next.js, Node.js, and modern web architectures.",
  keywords: "Fullstack Developer, Next.js, Node.js, MySQL, React, JavaScript, Portfolio",
  openGraph: {
    title: "Professional Portfolio | Fullstack Developer",
    description: "Building digital experiences that blend innovation with pixel-perfect design.",
    type: "website",
    locale: "en_US",
    url: "https://yourportfolio.com",
    siteName: "Sahin Portfolio",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} antialiased bg-dark-bg text-dark-text min-h-screen flex flex-col`}>
        {/* Animated Background Mesh */}
        <div className="fixed inset-0 bg-mesh opacity-30 pointer-events-none -z-10 animate-gradient bg-[length:200%_200%] overflow-hidden" />
        
        <Navbar />
        <main className="flex-grow pt-32 pb-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
