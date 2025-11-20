import process from "node:process";
import { generateAnswer as openaiAnswer, getEmbedding as openaiEmbedding, isOpenAIConfigured } from "./openai-service";
import { generateAnswer as ollamaAnswer, getEmbedding as ollamaEmbedding, isOllamaConfigured } from "./ollama-service";
import { generateAnswer as geminiAnswer, getEmbedding as geminiEmbedding, isGeminiConfigured } from "./gemini-service";
import type { GenerateAnswerParams } from "./types";

type Provider = "openai" | "ollama" | "gemini";

const providerPreference = (process.env.LLM_PROVIDER || "").toLowerCase();

const pickProvider = (): Provider | null => {
  const wantOpenAI = providerPreference === "openai";
  const wantOllama = providerPreference === "ollama";
  const wantGemini = providerPreference === "gemini";

  console.log("[model-gateway] Provider preference:", providerPreference);
  console.log("[model-gateway] OpenAI configured:", isOpenAIConfigured());
  console.log("[model-gateway] Ollama configured:", isOllamaConfigured());
  console.log("[model-gateway] Gemini configured:", isGeminiConfigured());

  if (wantOpenAI && isOpenAIConfigured()) return "openai";
  if (wantOllama && isOllamaConfigured()) return "ollama";
  if (wantGemini && isGeminiConfigured()) return "gemini";

  if (isOpenAIConfigured()) return "openai";
  if (isOllamaConfigured()) return "ollama";
  if (isGeminiConfigured()) return "gemini";

  return null;
};

const getProvider = (): Provider => {
  const provider = pickProvider();
  if (!provider) {
    throw new Error("No LLM provider configured.");
  }
  return provider;
};

export const hasLLMSupport = () => Boolean(pickProvider());

export const getEmbedding = async (text: string) => {
  const provider = getProvider();
  if (provider === "openai") return openaiEmbedding(text);
  if (provider === "ollama") return ollamaEmbedding(text);
  return geminiEmbedding(text);
};

export const generateAnswer = async (params: GenerateAnswerParams) => {
  const provider = getProvider();

  if (provider === "openai") return openaiAnswer(params);
  if (provider === "ollama") return ollamaAnswer(params);
  return geminiAnswer(params);
};
