import type { GenerateAnswerParams } from "./types";

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

const normalizeModel = (model?: string) => {
  if (!model) return undefined;
  return model.startsWith("models/") ? model : `models/${model}`;
};

const getApiKey = () => process.env.GEMINI_API_KEY;

export const isGeminiConfigured = () => Boolean(getApiKey());

const request = async <T>(endpoint: string, payload: Record<string, unknown>): Promise<T> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const response = await fetch(`${GEMINI_BASE_URL}/${endpoint}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Gemini request failed: ${response.status} ${text}`);
  }

  return (await response.json()) as T;
};

export const getEmbedding = async (text: string) => {
  const normalized = text?.trim();
  if (!normalized) {
    throw new Error("Cannot create embedding for empty text");
  }

  const model = normalizeModel(process.env.GEMINI_EMBED_MODEL || "text-embedding-004") ?? "models/text-embedding-004";

  const result = await request<{ embedding?: { values?: number[] } }>(`${model}:embedContent`, {
    content: {
      parts: [{ text: normalized }],
    },
  });

  const embedding = result.embedding?.values;
  if (!embedding) {
    throw new Error("Gemini did not return an embedding");
  }
  return embedding;
};

const buildSystemPrompt = () =>
  "Bạn là NCDangBot – người bạn thân thiện của NCDang. " +
  "Phong cách trò chuyện ấm áp, thân mật, xưng “mình” hoặc “tớ”, có thể chào hỏi và dùng emoji nhẹ nhàng. " +
  "Khi câu hỏi liên quan đến NCDang, chỉ dùng chính xác dữ liệu trong ngữ cảnh được cung cấp. " +
  "Nếu câu hỏi nằm ngoài ngữ cảnh nhưng là chủ đề chung, hãy trả lời ngắn gọn bằng kiến thức phổ biến và đảm bảo chính xác. " +
  "Nếu không chắc chắn, hãy nói chưa có dữ liệu và gợi ý người dùng hỏi khác.";

export const generateAnswer = async ({
  context,
  question,
  language,
  allowGeneral = false,
}: GenerateAnswerParams) => {
  const model = normalizeModel(process.env.GEMINI_CHAT_MODEL || "gemini-2.0-flash-lite") ?? "models/gemini-2.0-flash-lite";

  const response = await request<{
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  }>(`${model}:generateContent`, {
    system_instruction: { parts: [{ text: buildSystemPrompt() }] },
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Ngữ cảnh:
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
      },
    ],
  });

  const text = response.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();
  return text || null;
};

