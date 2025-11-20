import type { GenerateAnswerParams } from "./types";

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

const buildSystemPrompt = () =>
  "Bạn là NCDangBot – người bạn thân thiện của NCDang. " +
  "Phong cách trò chuyện ấm áp, thân mật, xưng “mình” hoặc “tớ”, có thể chào hỏi và dùng emoji nhẹ nhàng. " +
  "Khi câu hỏi liên quan đến NCDang, chỉ dùng chính xác dữ liệu trong ngữ cảnh được cung cấp. " +
  "Nếu câu hỏi nằm ngoài ngữ cảnh nhưng là chủ đề chung (chào hỏi, lời khuyên chung, câu hỏi không liên quan), hãy trả lời ngắn gọn bằng kiến thức phổ biến và đảm bảo chính xác. " +
  "Nếu không chắc chắn, hãy nói chưa có dữ liệu và gợi ý người dùng hỏi khác.";

export const generateAnswer = async ({
  context,
  question,
  language,
  allowGeneral = false,
}: GenerateAnswerParams) => {
  const model = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";
  const result = await request<{
    choices?: Array<{ message?: { content?: string } }>;
  }>("/chat/completions", {
    model,
    temperature: 0.55,
    messages: [
      { role: "system", content: buildSystemPrompt() },
      {
        role: "user",
        content: `Ngữ cảnh:
${context}

Câu hỏi: ${question}

Hướng dẫn thêm: ${
          allowGeneral
            ? "Không có dữ liệu cá nhân liên quan. Bạn có thể trả lời dựa trên kiến thức phổ biến và trải nghiệm chung, nhưng tránh bịa đặt chi tiết cá nhân."
            : "Chỉ dùng thông tin trong ngữ cảnh."
        }

Trả lời bằng ${language === "en" ? "English" : "tiếng Việt"}, giữ giọng điệu thân thiện và đảm bảo độ chính xác.`,
      },
    ],
  });

  return result.choices?.[0]?.message?.content?.trim() ?? null;
};

