import { generateAnswer as geminiGenerateAnswer, isGeminiConfigured } from "@/lib/chatbot/gemini-service";

export const dynamic = "force-dynamic";

interface TopicSuggestRequest {
  title?: string;
  language?: string;
}

const sanitizeTopic = (value: string | null) => {
  if (!value) return "";
  const raw = value.trim();

  const quotedMatch = raw.match(/["'`“”‘’]([^"'`“”‘’]+)["'`“”‘’]/);
  const afterColon = raw.includes(":") ? raw.split(":").pop() : null;
  const afterLa = raw.match(/(?:la|là)\s+(.+)$/i)?.[1] ?? null;

  const candidate =
    quotedMatch?.[1] ||
    (afterLa ? afterLa : null) ||
    (afterColon ? afterColon : null) ||
    raw;

  const cleaned = candidate
    .replace(
      /(chao ban|chào bạn|xin chao|xin chào|minh nghi|mình nghĩ|chu de phu hop nhat|chủ đề phù hợp nhất|chu de|chủ đề|la|là)\s*[:\-]?\s*/gi,
      ""
    )
    .replace(/[.!?。！？]+/g, "")
    .replace(/^["'`“”‘’]+|["'`“”‘’]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "";

  const normalized = cleaned
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s*;\s*/g, ", ");

  const topics = normalized
    .split(",")
    .map((topic) => topic.trim())
    .filter(Boolean)
    .slice(0, 3)
    .map((topic) => topic.split(" ").slice(0, 3).join(" "));

  const result = topics.join(", ").slice(0, 80).trim();
  return result;
};

export async function POST(request: Request) {
  let payload: TopicSuggestRequest;

  try {
    payload = (await request.json()) as TopicSuggestRequest;
  } catch {
    return Response.json({ error: "Payload không hợp lệ." }, { status: 400 });
  }

  const title = payload.title?.trim() ?? "";
  if (!title) {
    return Response.json({ error: "Thiếu tên bài hát." }, { status: 400 });
  }

  if (!isGeminiConfigured()) {
    return Response.json({ error: "Gemini chưa được cấu hình." }, { status: 503 });
  }

  const language = payload.language?.trim() || "vi";

  try {
    const result = await geminiGenerateAnswer({
      context:
        "Dựa trên kho dữ liệu lớn về các bài hát phổ biến mà mô hình Gemini đã được huấn luyện, " +
        "hãy nhận diện bài hát thông qua tên bài hát và suy luận ra các chủ đề phổ biến, " +
        "thông thường nhất gắn liền với bài hát đó.\n" +
        "Chỉ trả lời 2-3 chủ đề, mỗi chủ đề 1-3 từ tiếng Việt, phân tách bằng dấu phẩy.\n" +
        "Không thêm lời chào, không giải thích.\n" +
        "Ví dụ: 'tình yêu', 'chia tay', 'tuổi trẻ', 'gia đình', 'quê hương', 'nỗi nhớ'.",
      question: `Tên bài hát: "${title}"\nChủ đề phù hợp nhất là gì?`,
      language,
      allowGeneral: true,
    });

    const topic = sanitizeTopic(result);
    if (!topic) {
      return Response.json({ error: "Không thể gợi ý chủ đề." }, { status: 502 });
    }

    return Response.json({ topic });
  } catch (error) {
    console.error("[topic-suggest] error:", error);
    return Response.json({ error: "Server gặp lỗi, thử lại sau." }, { status: 500 });
  }
}
