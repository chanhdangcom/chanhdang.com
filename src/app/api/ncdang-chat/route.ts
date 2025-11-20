import { fetchFacts } from "@/lib/chatbot/facts-repository";
import { buildLLMResponse, buildSimilarityResponse } from "@/lib/chatbot/response-service";
import { hasLLMSupport } from "@/lib/chatbot/model-gateway";

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
    const facts = await fetchFacts(language);

    let answer: string | undefined;
    const hasLLM = hasLLMSupport();
    console.log("[ncdang-chat] hasLLMSupport:", hasLLM);
    console.log("[ncdang-chat] LLM_PROVIDER:", getEnv("LLM_PROVIDER"));
    console.log("[ncdang-chat] GEMINI_API_KEY exists:", Boolean(getEnv("GEMINI_API_KEY")));

    if (hasLLM) {
      try {
        answer = await buildLLMResponse(facts, message, language);
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
    }

    return Response.json({ answer });
  } catch (error) {
    console.error("[ncdang-chat] internal error", error);
    if (error instanceof Error) {
      console.error("[ncdang-chat] error message:", error.message);
    }
    return Response.json({ error: "Server gặp lỗi, thử lại sau." }, { status: 500 });
  }
}

function getEnv(key: string) {
  const envHolder = (globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  }).process?.env;

  return envHolder?.[key];
}

