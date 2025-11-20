import { ChatbotPanel } from "@/components/chatbot/chatbot-panel";
import { Header } from "../[locale]/features/profile /header";
import { Footer } from "../[locale]/features/profile /footer";

type ChatbotPageMetadata = {
  title: string;
  description: string;
};

export const metadata: ChatbotPageMetadata = {
  title: "NCDangBot Chat | Chánh Đang",
  description:
    "Tương tác với chatbot cá nhân NCDangBot ngay trên chanhdang.com.",
};

export default function ChatbotPage() {
  return (
    <div className="z-50">
      <header className="mx-0 p-2 md:mx-48">
        <Header />
      </header>

      <div className="mx-auto mt-12 w-full max-w-5xl">
        <ChatbotPanel className="max-w-full" />
      </div>

      <Footer />
    </div>
  );
}
