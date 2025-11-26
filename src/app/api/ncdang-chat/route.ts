import { fetchFacts } from "@/lib/chatbot/facts-repository";
import { detectMusicIntent, detectThemeIntent, MUSIC_AUDIO_PAYLOAD } from "@/lib/chatbot/intent-service";
import { hasLLMSupport } from "@/lib/chatbot/model-gateway";
import { buildLLMResponse, buildSimilarityResponse } from "@/lib/chatbot/response-service";
import { searchMusicByTitle, getRandomMusic } from "@/lib/chatbot/music-search-service";

export const dynamic = "force-dynamic";

interface ChatRequest {
  message?: string;
  language?: string;
}

export async function POST(request: Request) {
  let payload: ChatRequest;

  try {
    payload = (await request.json()) as ChatRequest;
  } catch {
    return Response.json({ error: "Payload không hợp lệ." }, { status: 400 });
  }

  const message = payload.message?.trim() ?? "";
  if (!message) {
    return Response.json({ error: "Vui lòng nhập nội dung câu hỏi." }, { status: 400 });
  }

  const language = payload.language?.trim() || getEnv("NCDANG_BOT_DEFAULT_LANGUAGE") || "vi";

  try {
    console.log("[ncdang-chat] Starting request processing");
    console.log("[ncdang-chat] MONGODB_URI exists:", Boolean(process.env.MONGODB_URI));
    console.log("[ncdang-chat] NCDANG_BOT_DB:", process.env.NCDANG_BOT_DB);
    
    const musicIntentPromise = detectMusicIntent(message).catch((error) => {
      console.error("[ncdang-chat] detectMusicIntent error:", error);
      return { isMusicRequest: false } as const;
    });

    const themeIntentPromise = detectThemeIntent(message).catch((error) => {
      console.error("[ncdang-chat] detectThemeIntent error:", error);
      return null;
    });

    const factsPromise = fetchFacts(language);

    const [facts, musicIntent, themeIntent] = await Promise.all([factsPromise, musicIntentPromise, themeIntentPromise]);
    console.log("[ncdang-chat] Facts fetched:", facts.length);

    if (musicIntent.isMusicRequest) {
      const songTitle = musicIntent.songTitle;
      console.log("[ncdang-chat] Music intent detected", songTitle ? `- Song: ${songTitle}` : "");

      // If specific song requested, search for it
      if (songTitle) {
        const foundMusic = await searchMusicByTitle(songTitle);
        
        if (foundMusic && foundMusic.audio) {
          console.log("[ncdang-chat] Found song:", foundMusic.title, "by", foundMusic.singer);
          return Response.json({
            answer: `Đã tìm thấy bài "${foundMusic.title}" của ${foundMusic.singer}. Nghe thử nhé! 🎵`,
            audio: {
              url: foundMusic.audio,
              autoPlay: true,
            },
            music: {
              id: foundMusic.id,
              title: foundMusic.title,
              singer: foundMusic.singer,
              cover: foundMusic.cover,
              audio: foundMusic.audio,
              youtube: foundMusic.youtube,
            },
          });
        } else {
          // Song not found, offer random or suggest
          console.log("[ncdang-chat] Song not found:", songTitle);
          const randomMusic = await getRandomMusic();
          
          if (randomMusic && randomMusic.audio) {
            return Response.json({
              answer: `Mình không tìm thấy bài "${songTitle}" trong thư viện. Mình phát một bài khác cho bạn nhé! 🎵`,
              audio: {
                url: randomMusic.audio,
                autoPlay: true,
              },
              music: {
                id: randomMusic.id,
                title: randomMusic.title,
                singer: randomMusic.singer,
                cover: randomMusic.cover,
                youtube: randomMusic.youtube,
              },
            });
          }
        }
      }

      // General music request - use default payload
      return Response.json(MUSIC_AUDIO_PAYLOAD);
    }

    if (themeIntent) {
      console.log("[ncdang-chat] Theme intent detected:", themeIntent);
      const themeMessages: Record<"light" | "dark", string> = {
        light: "Đã chuyển sang giao diện sáng rồi nhé! ",
        dark: "Đã chuyển sang giao diện tối rồi nhé! ",
      };
      return Response.json({
        answer: themeMessages[themeIntent],
        action: {
          type: "theme",
          value: themeIntent,
        },
      });
    }

    let answer: string | undefined;
    const hasLLM = hasLLMSupport();
    console.log("[ncdang-chat] hasLLMSupport:", hasLLM);
    console.log("[ncdang-chat] LLM_PROVIDER:", process.env.LLM_PROVIDER);
    console.log("[ncdang-chat] GEMINI_API_KEY exists:", Boolean(process.env.GEMINI_API_KEY));

    if (hasLLM) {
      try {
        // buildLLMResponse may return string | null, but answer should be string | undefined
        const llmAnswer = await buildLLMResponse(facts, message, language);
        answer = llmAnswer ?? undefined;
        console.log("[ncdang-chat] LLM response received:", answer ? "yes" : "no");
      } catch (error) {
        console.error("[ncdang-chat] llm error", error);
        if (error instanceof Error) {
          console.error("[ncdang-chat] error message:", error.message);
          console.error("[ncdang-chat] error stack:", error.stack);
        }
      }
    } else {
      console.log("[ncdang-chat] No LLM support, using similarity matching");
    }

    if (!answer) {
      answer = buildSimilarityResponse(facts, message, language);
      console.log("[ncdang-chat] Using similarity response");
    }

    return Response.json({ answer });
  } catch (error) {
    console.error("[ncdang-chat] internal error", error);
    if (error instanceof Error) {
      console.error("[ncdang-chat] error message:", error.message);
      console.error("[ncdang-chat] error stack:", error.stack);
    }
    return Response.json({ 
      error: "Server gặp lỗi, thử lại sau.",
      details: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 });
  }
}

function getEnv(key: string) {
  return process.env[key];
}

