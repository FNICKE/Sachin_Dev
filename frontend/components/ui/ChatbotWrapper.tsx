"use client";
import dynamic from "next/dynamic";

// Dynamically import with ssr:false inside a dedicated client wrapper
// This is the correct pattern for using dynamic() in Next.js App Router
const PortfolioChatbot = dynamic(
  () => import("@/components/ui/PortfolioChatbot"),
  { ssr: false }
);

export default function ChatbotWrapper() {
  return <PortfolioChatbot />;
}
