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
    <div className="z-50 bg-zinc-950">
      <div className="mx-auto h-screen max-w-full">
        <ChatbotPanel className="h-screen w-full max-w-full rounded-none" />
      </div>
    </div>
  );
}
