import { ChatbotPanel } from "@/components/chatbot/chatbot-panel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NCDangBot Chat | ChanhDang",
  description:
    "Tương tác với chatbot cá nhân NCDangBot ngay trên chanhdang.com. Chat với AI để tìm hiểu về portfolio, dự án, và kinh nghiệm của Chánh Đang.",
  applicationName: "ChanhDang",
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
    siteName: "ChanhDang",
    images: [
      {
        url: "https://cdn.chanhdang.com/ncdang_cover_2.jpg",
        width: 1200,
        height: 630,
        alt: "NCDangBot Chat | ChanhDang",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NCDangBot Chat | ChanhDang",
    description:
      "Tương tác với chatbot cá nhân NCDangBot ngay trên chanhdang.com.",
    creator: "@chanhdang",
    site: "https://chanhdang.com",
    images: ["https://cdn.chanhdang.com/ncdang_cover_2.jpg"],
  },
  metadataBase: new URL("https://chanhdang.com"),
  alternates: {
    canonical: "https://chanhdang.com/chatbot",
    languages: {
      en: "https://chanhdang.com/en",
      vi: "https://chanhdang.com/vi",
    },
  },
};

export default function ChatbotPage() {
  return (
    <div className="fixed inset-0 flex h-full w-full items-center justify-center">
      <ChatbotPanel className="h-full" />
    </div>
  );
}
