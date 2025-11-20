import type { GenerateAnswerParams } from "./types";

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
  const prompt = `Ngữ cảnh:
${context}

Câu hỏi: ${question}

Hướng dẫn thêm: ${
    allowGeneral
      ? "Không có dữ liệu cá nhân liên quan. Bạn có thể trả lời dựa trên kiến thức phổ biến và trải nghiệm chung, nhưng tránh bịa đặt chi tiết cá nhân."
      : "Chỉ dùng thông tin trong ngữ cảnh."
  }

Trả lời bằng ${language === "en" ? "English" : "tiếng Việt"}, giữ giọng điệu thân thiện và đảm bảo độ chính xác.`;

  const result = await request<{ response?: string }>("/api/generate", {
    model: chatModel,
    prompt: `${buildSystemPrompt()}\n\n${prompt}`,
    stream: false,
    options: {
      temperature: 0.6,
    },
  });

  return result.response?.trim() ?? null;
};

