import type { GenerateAnswerParams } from "./types";
import { buildSystemPrompt, buildUserPrompt } from "./system-prompt";

const OPENAI_BASE_URL = "https://api.openai.com/v1";

const getApiKey = () => process.env.OPENAI_API_KEY;

export const isOpenAIConfigured = () => Boolean(getApiKey());

const request = async <T>(endpoint: string, payload: Record<string, unknown>): Promise<T> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  const response = await fetch(`${OPENAI_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${error}`);
  }

  return (await response.json()) as T;
};

export const getEmbedding = async (text: string) => {
  const normalized = text?.trim();
  if (!normalized) {
    throw new Error("Cannot create embedding for empty text");
  }

  const model = process.env.OPENAI_EMBED_MODEL || "text-embedding-3-small";

  const result = await request<{ data?: Array<{ embedding: number[] }> }>("/embeddings", {
    model,
    input: normalized,
  });

  const embedding = result.data?.[0]?.embedding;
  if (!embedding) {
    throw new Error("OpenAI did not return an embedding");
  }
  return embedding;
};


export const generateAnswer = async ({
  context,
  question,
  language,
  allowGeneral = false,
}: GenerateAnswerParams) => {
  const model = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";
  const userPrompt = buildUserPrompt({ context, question, language, allowGeneral });
  
  const result = await request<{
    choices?: Array<{ message?: { content?: string } }>;
  }>("/chat/completions", {
    model,
    temperature: 0.55,
    messages: [
      { role: "system", content: buildSystemPrompt() },
      { role: "user", content: userPrompt },
    ],
  });

  return result.choices?.[0]?.message?.content?.trim() ?? null;
};

