import { fetchFacts } from "@/lib/chatbot/facts-repository";
import { detectMusicIntent, MUSIC_AUDIO_PAYLOAD } from "@/lib/chatbot/intent-service";
import { hasLLMSupport } from "@/lib/chatbot/model-gateway";
import { buildLLMResponse, buildSimilarityResponse } from "@/lib/chatbot/response-service";

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
      return false;
    });

    const factsPromise = fetchFacts(language);

    const [facts, shouldPlayMusic] = await Promise.all([factsPromise, musicIntentPromise]);
    console.log("[ncdang-chat] Facts fetched:", facts.length);

    if (shouldPlayMusic) {
      console.log("[ncdang-chat] Music intent detected");
      return Response.json(MUSIC_AUDIO_PAYLOAD);
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

