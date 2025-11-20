import { ChatbotPanel } from "@/components/chatbot/chatbot-panel";

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
      <div className="mx-auto w-full max-w-full">
        <ChatbotPanel className="h-screen max-w-full rounded-none" />
      </div>
    </div>
  );
}
