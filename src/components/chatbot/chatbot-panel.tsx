"use client";

import { cn } from "@/utils/cn";
import { PaperPlaneRight, X } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Ping } from "../ping";

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
  "Team bạn hiện tại có bao nhiêu người?",
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
        "z-20 flex w-full max-w-full flex-col gap-2 rounded-3xl border border-white/10 bg-zinc-950 pb-2 text-white shadow-2xl backdrop-blur-xl sm:max-w-3xl",
        className
      )}
    >
      <header className="absolute z-10 flex w-full items-center gap-3 rounded-t-3xl bg-white/5 px-4 py-3 shadow-inner backdrop-blur">
        <Image
          src={"/img/gemini-icon.webp"}
          alt="NCDangBot"
          width={64}
          height={64}
          className="h-12 w-12 rounded-full border border-white/20 object-cover"
        />
        <div className="flex-1 space-y-1">
          <p className="text-base font-semibold leading-tight">ChanhDang AI</p>

          <p className="flex items-center gap-1 text-xs text-emerald-300">
            <Ping />

            <div> Đang hoạt động</div>
          </p>
        </div>

        <button
          type="button"
          aria-label="Đóng chatbot"
          onClick={() => handle?.()}
          className="rounded-full p-2 text-white transition hover:bg-white/10"
        >
          <X size={20} weight="bold" />
        </button>
      </header>

      <div
        ref={scrollRef}
        className="mx-2 flex h-[40vh] flex-col gap-3 overflow-y-auto sm:h-[45vh]"
      >
        {messages.map((message, index) => {
          const isUser = message.role === "user";

          return (
            <div
              key={message.id}
              className={cn(
                "flex w-full items-end gap-2",
                index === 0 && "mt-24",
                isUser ? "flex-row-reverse text-right" : "text-left"
              )}
            >
              {!isUser && (
                <Image
                  src={"/img/gemini-icon.webp"}
                  alt="Bot"
                  width={32}
                  height={32}
                  className="hidden h-8 w-8 rounded-full border border-white/20 object-cover sm:block"
                />
              )}

              <article
                className={cn(
                  "max-w-[82%] rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm",
                  isUser
                    ? "bg-gradient-to-r from-cyan-500 to-sky-500 text-white"
                    : "bg-white/10 text-zinc-50 backdrop-blur"
                )}
              >
                {isSubmitting
                  ? index === messages.length - 1
                    ? "..."
                    : "..."
                  : message.content}
              </article>

              {isUser && <div className="hidden h-8 w-8 sm:block" />}
            </div>
          );
        })}
      </div>

      <div className="flex snap-x gap-2 overflow-x-auto pb-1">
        {SAMPLE_QUESTIONS.map((question, index) => (
          <button
            key={question}
            type="button"
            className={cn(
              "shrink-0 rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-200 shadow-sm transition hover:border-cyan-400/60 hover:bg-white/5 hover:text-white",
              index === 0 && "ml-2"
            )}
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
        className="mx-2 flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-3 py-2 shadow-inner backdrop-blur"
      >
        <input
          name="message"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Bạn muốn hỏi gì?"
          className="h-8 flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
          autoComplete="off"
          autoFocus
        />

        <button
          type="submit"
          disabled={!canSubmit}
          className="flex size-8 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 text-white transition hover:opacity-90 disabled:bg-zinc-600 disabled:text-zinc-200"
        >
          {isSubmitting ? "..." : <PaperPlaneRight size={22} weight="fill" />}
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
