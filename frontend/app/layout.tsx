import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
      <body className="min-h-screen flex flex-col relative"
        style={{ background: '#020817', color: '#f8fafc' }}>
        <div className="bg-grid fixed inset-0 opacity-40 mix-blend-overlay pointer-events-none z-[-2]"></div>
        <div className="bg-noise fixed inset-0 opacity-20 pointer-events-none z-[-1]"></div>
        <div className="aurora"></div>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow z-10 relative">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
