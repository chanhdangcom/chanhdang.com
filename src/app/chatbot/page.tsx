import { ChatbotPanel } from "@/components/chatbot/chatbot-panel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NCDangBot Chat | ChanhDang",
  description:
    "Tương tác với chatbot cá nhân NCDangBot ngay trên chanhdang.com. Chat với AI để tìm hiểu về portfolio, dự án, và kinh nghiệm của Chánh Đang.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "NCDangBot Chat | ChanhDang",
    description:
      "Tương tác với chatbot cá nhân NCDangBot ngay trên chanhdang.com.",
    url: "https://chanhdang.com/chatbot",
    type: "website",
  },
  alternates: {
    canonical: "https://chanhdang.com/chatbot",
  },
};

export default function ChatbotPage() {
  return (
    <div className="fixed inset-0 flex h-full w-full items-center justify-center">
      <ChatbotPanel className="h-full" />
    </div>
  );
}
