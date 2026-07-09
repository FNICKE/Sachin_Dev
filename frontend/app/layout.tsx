import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import ChatbotWrapper from "@/components/ui/ChatbotWrapper";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col relative"
        style={{ background: '#020817', color: '#f8fafc' }}>

        {/* Original backgrounds */}
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

        {/* AI Chatbot */}
        <ChatbotWrapper />
      </body>
    </html>
  );
}
