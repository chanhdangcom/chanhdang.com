"use client";

import { cn } from "@/utils/cn";
import { PaperPlaneRight, Play, X } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useTheme } from "next-themes";
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Ping } from "../ping";
import { useAudio } from "@/components/music-provider";
import type { IMusic } from "@/app/[locale]/features/profile/types/music";
import type {
  ChatAction,
  ChatApiResponse,
  ChatMusic,
} from "@/lib/chatbot/contracts";
import { useUser } from "@/hooks/use-user";
import { buildUserAuthHeaders } from "@/lib/client-auth";

type ChatRole = "user" | "bot";

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  actions?: ChatAction[];
}

type IProp = {
  className?: string;
  handle?: () => void;
};

const SAMPLE_QUESTIONS = [
  "Có bài nào đang hot / nhiều lượt nghe không?",
  "Gợi ý nhạc chill hoặc rap trong thư viện nhé.",
  "Mở một bài bất kỳ cho mình nghe thử.",
  "Cho mình biết vài dự án nổi bật của bạn?",
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
const CHAT_HISTORY_ENDPOINT = "/api/chatbot-history";

const INTRO_MESSAGES: ChatMessage[] = [
  {
    id: "intro",
    role: "bot",
    content:
      "Mình là ChanhDang AI — có thể trò chuyện về Chánh Đang, gợi ý / mở nhạc trong thư viện ChanhDang (hot, theo ca sĩ, chill, rap…). Bạn muốn thử điều gì?",
  },
];

type LegacyChatApiResponse = ChatApiResponse & {
  action?: {
    type: "theme";
    value: "light" | "dark";
  };
  audio?: {
    url: string;
    autoPlay?: boolean;
  };
  music?: {
    id: string;
    title: string;
    singer: string;
    cover: string;
    audio?: string;
    youtube?: string;
  };
};

const toPlayerMusic = (track: ChatMusic): IMusic => ({
  id: track.id,
  title: track.title,
  singer: track.singer,
  cover: track.cover,
  audio: track.audio,
  youtube: track.youtube || "",
  content: track.content || "",
  type: track.type,
  srt: undefined,
  beat: undefined,
});

function MusicSuggestionCard({
  track,
  label,
  onPlay,
}: {
  track: ChatMusic;
  label?: string;
  onPlay: (track: ChatMusic) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-2">
      <div className="flex items-center gap-3">
        <Image
          src={track.cover || "/img/default-music-cover.png"}
          alt={track.title}
          width={56}
          height={56}
          className="size-14 rounded-xl object-cover"
        />

        <div className="min-w-0 flex-1">
          {label ? (
            <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-cyan-300">
              {label}
            </p>
          ) : null}

          <p className="truncate font-medium text-white">{track.title}</p>
          <p className="truncate text-xs text-zinc-300">{track.singer}</p>
        </div>

        <button
          type="button"
          onClick={() => onPlay(track)}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          aria-label={`Phát ${track.title}`}
        >
          <Play size={20} weight="fill" />
        </button>
      </div>
    </div>
  );
}

export function ChatbotPanel({ className, handle }: IProp) {
  const { setTheme } = useTheme();
  const { handlePlayAudio } = useAudio();
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>(INTRO_MESSAGES);
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readyToPersist, setReadyToPersist] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const userId = user?.id;
    if (!userId) {
      setReadyToPersist(false);
      setMessages(INTRO_MESSAGES);
      return;
    }

    setReadyToPersist(false);
    let cancelled = false;

    void (async () => {
      try {
        const res = await fetch(CHAT_HISTORY_ENDPOINT, {
          headers: buildUserAuthHeaders(userId),
          cache: "no-store",
        });
        if (!res.ok || cancelled) {
          if (!cancelled) {
            setReadyToPersist(true);
          }
          return;
        }
        const data = (await res.json()) as { messages?: ChatMessage[] };
        if (cancelled) {
          return;
        }
        if (Array.isArray(data.messages) && data.messages.length > 0) {
          setMessages(data.messages);
        } else {
          setMessages(INTRO_MESSAGES);
        }
      } catch {
        if (!cancelled) {
          setMessages(INTRO_MESSAGES);
        }
      } finally {
        if (!cancelled) {
          setReadyToPersist(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    const userId = user?.id;
    if (!userId || !readyToPersist) {
      return;
    }

    const handle = window.setTimeout(() => {
      void fetch(CHAT_HISTORY_ENDPOINT, {
        method: "PUT",
        headers: {
          ...buildUserAuthHeaders(userId),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      }).catch(() => {});
    }, 600);

    return () => window.clearTimeout(handle);
  }, [messages, user?.id, readyToPersist]);

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

  const playTrack = useCallback(
    (track: ChatMusic) => {
      handlePlayAudio(toPlayerMusic(track));
    },
    [handlePlayAudio]
  );

  const applyActions = useCallback(
    (actions: ChatAction[]) => {
      actions.forEach((action) => {
        if (action.type === "theme") {
          if (document.startViewTransition) {
            document.startViewTransition(() => {
              setTheme(action.value);
            });
          } else {
            setTheme(action.value);
          }
        }

        if (action.type === "play-music" && action.autoPlay) {
          playTrack(action.track);
        }
      });
    },
    [playTrack, setTheme]
  );

  const normalizeActions = useCallback(
    (data: LegacyChatApiResponse): ChatAction[] => {
      const nextActions = [...(data.actions ?? [])];

      if (
        data.action &&
        !nextActions.some((action) => action.type === "theme")
      ) {
        nextActions.push({
          type: "theme",
          value: data.action.value,
        });
      }

      const legacyAudioUrl = data.music?.audio || data.audio?.url;
      if (
        data.music &&
        legacyAudioUrl &&
        !nextActions.some((action) => action.type === "play-music")
      ) {
        nextActions.push({
          type: "play-music",
          track: {
            id: data.music.id,
            title: data.music.title,
            singer: data.music.singer,
            cover: data.music.cover,
            audio: legacyAudioUrl,
            youtube: data.music.youtube,
          },
          autoPlay: data.audio?.autoPlay ?? Boolean(legacyAudioUrl),
        });
      }

      return nextActions;
    },
    []
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

      const data = (await response.json()) as LegacyChatApiResponse;
      const content =
        data.answer?.trim() ??
        data.error?.trim() ??
        "Xin lỗi, mình chưa thể trả lời câu này. Bạn thử lại sau nhé.";
      const actions = normalizeActions(data);
      applyActions(actions);

      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "bot",
          content,
          actions,
        },
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
      <header className="absolute top-0 z-10 flex w-full items-center gap-3 rounded-t-3xl bg-white/5 px-4 py-3 shadow-inner backdrop-blur">
        <Image
          src={"/img/gemini-icon.webp"}
          alt="NCDangBot"
          width={64}
          height={64}
          className="size-10 rounded-full border border-white/20 object-cover"
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
        className="mx-2 flex h-auto flex-col gap-3 overflow-y-auto rounded-3xl sm:h-[70vh]"
      >
        {messages.map((message, index) => {
          const isUser = message.role === "user";

          return (
            <div
              key={message.id}
              className={cn(
                "flex w-full items-end gap-2",
                index === 0 && "mt-24",
                index === messages.length - 1 && "mb-28",
                isUser ? "flex-row-reverse text-left" : "text-left"
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
                  "max-w-[82%] space-y-2 rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm",
                  isUser
                    ? "bg-gradient-to-r from-cyan-500 to-sky-500 text-white"
                    : "bg-white/10 text-zinc-50 backdrop-blur"
                )}
              >
                <p>{message.content}</p>

                {message.actions?.map((action, actionIndex) => {
                  if (action.type === "play-music") {
                    return (
                      <MusicSuggestionCard
                        key={`${message.id}-action-${actionIndex}`}
                        track={action.track}
                        label={action.autoPlay ? "Đang phát" : "Bài hát"}
                        onPlay={playTrack}
                      />
                    );
                  }

                  if (action.type === "suggest-music") {
                    return (
                      <div
                        key={`${message.id}-action-${actionIndex}`}
                        className="space-y-2"
                      >
                        {action.reason ? (
                          <p className="text-xs text-zinc-300">
                            {action.reason === "fallback"
                              ? "Mình chưa thấy đúng bài bạn yêu cầu, thử một trong các bài này nhé."
                              : "Mấy bài này có thể hợp với bạn."}
                          </p>
                        ) : null}

                        {action.tracks.map((track) => (
                          <MusicSuggestionCard
                            key={`${message.id}-${track.id}`}
                            track={track}
                            label="Gợi ý"
                            onPlay={playTrack}
                          />
                        ))}
                      </div>
                    );
                  }

                  return null;
                })}
              </article>

              {isUser && <div className="hidden h-8 w-8 sm:block" />}
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-4 space-y-1">
        <div className="flex snap-x gap-2 overflow-x-auto pb-1">
          {SAMPLE_QUESTIONS.map((question, index) => (
            <button
              key={question}
              type="button"
              className={cn(
                "shrink-0 rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-200 shadow-sm backdrop-blur-sm transition hover:border-cyan-400/60 hover:bg-white/5 hover:text-white",
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
            className="h-8 flex-1 bg-transparent text-base text-white placeholder:text-zinc-500 focus:outline-none"
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
      </div>

      {error ? (
        <p className="text-center text-sm text-rose-300">{error}</p>
      ) : (
        <p />
      )}
    </div>
  );
}

export default ChatbotPanel;
