import type { GenerateAnswerParams } from "./types";
import { buildSystemPrompt, buildUserPrompt } from "./system-prompt";

const DEFAULT_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const chatModel = process.env.OLLAMA_CHAT_MODEL || process.env.OLLAMA_MODEL || "llama3.1";
const embedModel = process.env.OLLAMA_EMBED_MODEL || process.env.OLLAMA_MODEL || "nomic-embed-text";

const request = async <T>(endpoint: string, payload: Record<string, unknown>): Promise<T> => {
  const response = await fetch(`${DEFAULT_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ollama request failed: ${response.status} ${text}`);
  }

  return (await response.json()) as T;
};

export const isOllamaConfigured = () => Boolean(process.env.OLLAMA_CHAT_MODEL || process.env.OLLAMA_MODEL);

export const getEmbedding = async (text: string) => {
  const normalized = text?.trim();
  if (!normalized) {
    throw new Error("Cannot create embedding for empty text");
  }

  const result = await request<{ embedding: number[] }>("/api/embeddings", {
    model: embedModel,
    prompt: normalized,
  });

  return result.embedding;
};


export const generateAnswer = async ({
  context,
  question,
  language,
  allowGeneral = false,
}: GenerateAnswerParams) => {
  const userPrompt = buildUserPrompt({ context, question, language, allowGeneral });

  const result = await request<{ response?: string }>("/api/generate", {
    model: chatModel,
    prompt: `${buildSystemPrompt()}\n\n${userPrompt}`,
    stream: false,
    options: {
      temperature: 0.6,
    },
  });

  return result.response?.trim() ?? null;
};

