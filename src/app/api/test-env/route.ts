import { NextResponse } from "next/server";
import { isGeminiConfigured } from "@/lib/chatbot/gemini-service";
import { hasLLMSupport } from "@/lib/chatbot/model-gateway";

export async function GET() {
  return NextResponse.json({
    MONGODB_URI: process.env.MONGODB_URI ? "***" : undefined,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ? "***" : undefined,
    LLM_PROVIDER: process.env.LLM_PROVIDER,
    GEMINI_CHAT_MODEL: process.env.GEMINI_CHAT_MODEL,
    GEMINI_EMBED_MODEL: process.env.GEMINI_EMBED_MODEL,
    NCDANG_BOT_DEFAULT_LANGUAGE: process.env.NCDANG_BOT_DEFAULT_LANGUAGE,
    isGeminiConfigured: isGeminiConfigured(),
    hasLLMSupport: hasLLMSupport(),
  });
}
