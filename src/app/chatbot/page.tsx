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
    <div className="fixed inset-0 flex h-full w-full items-center justify-center">
      <ChatbotPanel className="h-full" />
    </div>
  );
}
