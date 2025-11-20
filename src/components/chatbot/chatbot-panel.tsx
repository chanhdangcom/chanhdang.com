"use client";

import { cn } from "@/utils/cn";
import { PaperPlaneRight, X } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type ChatRole = "user" | "bot";

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

type IProp = {
  className?: string;
  handle?: () => void;
};

const SAMPLE_QUESTIONS = [
  "Bạn đang làm gì dạo này?",
  "Cho mình biết vài dự án nổi bật nhé?",
  "Sở thích cá nhân của bạn là gì?",
];

const createId = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const CHAT_ENDPOINT = "/api/ncdang-chat";

export function ChatbotPanel({ className, handle }: IProp) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro",
      role: "bot",
      content: "Mình là NCDangBot. Bạn muốn biết gì về Chánh Đang ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const canSubmit = useMemo(
    () => Boolean(input.trim()) && !isSubmitting,
    [input, isSubmitting]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const text = input.trim();
    if (!text) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
        cache: "no-store",
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(
          payload?.error ?? "Máy chủ không phản hồi, thử lại sau nhé."
        );
      }

      const data = (await response.json()) as {
        answer?: string;
        error?: string;
      };
      const content =
        data.answer?.trim() ??
        data.error?.trim() ??
        "Xin lỗi, mình chưa thể trả lời câu này. Bạn thử lại sau nhé.";

      setMessages((prev) => [
        ...prev,
        { id: createId(), role: "bot", content },
      ]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại.";
      setError(message);
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "bot",
          content: message,
        },
      ]);
    } finally {
      setIsSubmitting(false);
      formRef.current
        ?.querySelector<HTMLInputElement>('input[name="message"]')
        ?.focus();
    }
  };

  return (
    <div
      className={cn(
        "z-20 flex max-w-3xl flex-col gap-6 rounded-3xl border border-white/10 bg-zinc-900 p-4 dark:backdrop-blur-2xl",
        className
      )}
    >
      <div className="flex items-center gap-1">
        <Image
          src={"/img/NCDangBot.png"}
          alt="NCDangBot"
          width={100}
          height={100}
          className="h-auto w-12"
        />

        <div className="text-xl font-semibold text-zinc-50">ChanhDang AI</div>
      </div>

      <div className="absolute right-4 top-4" onClick={() => handle?.()}>
        <X size={24} weight="bold" className="text-zinc-50" />
      </div>

      <div
        ref={scrollRef}
        className="flex h-[40vh] flex-col gap-3 overflow-y-auto rounded-3xl border border-white/5 bg-black/20 p-4"
      >
        {messages.map((message) => (
          <article
            key={message.id}
            className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
              message.role === "user"
                ? "ml-auto bg-cyan-500 text-zinc-50"
                : "mr-auto bg-white/10 text-zinc-100 backdrop-blur"
            }`}
          >
            {message.content}
          </article>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {SAMPLE_QUESTIONS.map((question) => (
          <button
            key={question}
            type="button"
            className="rounded-full border border-white/10 px-3 py-1 text-sm text-zinc-200 transition hover:border-cyan-400/60 hover:text-white"
            onClick={() => setInput(question)}
            disabled={isSubmitting}
          >
            {question}
          </button>
        ))}
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-row gap-3"
      >
        <input
          name="message"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Bạn Muốn Hỏi Gì ?"
          className="h-12 flex-1 rounded-full border border-white/10 bg-black/40 px-5 text-sm text-white outline-none transition focus:border-cyan-400"
          autoComplete="off"
          autoFocus
        />

        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-full bg-cyan-400 p-2 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
        >
          {isSubmitting ? (
            "Đang gửi..."
          ) : (
            <PaperPlaneRight size={32} weight="fill" className="seiz-6" />
          )}
        </button>
      </form>

      {error ? (
        <p className="text-center text-sm text-rose-300">{error}</p>
      ) : (
        <p />
      )}
    </div>
  );
}

export default ChatbotPanel;
