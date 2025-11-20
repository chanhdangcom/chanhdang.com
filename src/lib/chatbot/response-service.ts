import { cosineSimilarity } from "./cosine";
import { generateAnswer, getEmbedding, hasLLMSupport } from "./model-gateway";
import type { FactRecord } from "./types";

const FALLBACK_RESPONSES: Record<string, string> = {
  vi: "Xin lỗi, tôi chưa có thông tin phù hợp. Bạn có thể hỏi cách khác không?",
  en: "Sorry, I don't have that information yet. Could you ask differently?",
};

const fallbackMessage = (language?: string) =>
  FALLBACK_RESPONSES[language ?? "vi"] || FALLBACK_RESPONSES.vi;

const normalize = (value: string) => value.toLowerCase().trim();

const buildBigrams = (value: string) => {
  const normalizedValue = normalize(value);
  const grams = new Map<string, number>();
  for (let i = 0; i < normalizedValue.length - 1; i += 1) {
    const gram = normalizedValue.slice(i, i + 2);
    grams.set(gram, (grams.get(gram) ?? 0) + 1);
  }
  return grams;
};

const diceCoefficient = (a: string, b: string) => {
  if (!a.length || !b.length) {
    return 0;
  }
  if (a === b) {
    return 1;
  }

  const aBigrams = buildBigrams(a);
  const bBigrams = buildBigrams(b);

  let matches = 0;

  bBigrams.forEach((count, gram) => {
    const available = aBigrams.get(gram);
    if (available) {
      matches += Math.min(available, count);
    }
  });

  const totalBigrams = Array.from(aBigrams.values()).reduce((sum, value) => sum + value, 0) +
    Array.from(bBigrams.values()).reduce((sum, value) => sum + value, 0);

  return totalBigrams ? (2 * matches) / totalBigrams : 0;
};

export const buildSimilarityResponse = (facts: FactRecord[], message: string, language = "vi") => {
  if (!facts.length) {
    return fallbackMessage(language);
  }

  const matches = facts
    .flatMap((fact) => fact.questions.map((question) => ({ fact, question })))
    .map(({ fact, question }) => ({
      rating: diceCoefficient(question, message),
      fact,
    }))
    .sort((a, b) => b.rating - a.rating);

  const best = matches[0];
  if (!best || best.rating < 0.4) {
    return fallbackMessage(language);
  }

  return best.fact.answer;
};

export const buildLLMResponse = async (facts: FactRecord[], message: string, language = "vi") => {
  if (!facts.length || !hasLLMSupport()) {
    return fallbackMessage(language);
  }

  const queryEmbedding = await getEmbedding(message);
  const scoredFacts = facts
    .filter((fact) => Array.isArray(fact.embedding) && fact.embedding.length)
    .map((fact) => ({
      fact,
      score: cosineSimilarity(queryEmbedding, fact.embedding ?? []),
    }))
    .filter((item) => Number.isFinite(item.score) && item.score > 0);

  const topK = Number(process.env.RETRIEVAL_TOP_K || 5);
  const hasMatches = scoredFacts.length > 0;
  const context = hasMatches
    ? scoredFacts
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .map(
          ({ fact }) =>
            `Câu hỏi mẫu: ${fact.questions.join(" / ")}\nTrả lời: ${fact.answer}\nTags: ${fact.tags?.join(", ") ?? "none"}`
        )
        .join("\n---\n")
    : "Không có dữ liệu cá nhân liên quan đến câu hỏi này.";

  const answer = await generateAnswer({
    context,
    question: message,
    language,
    allowGeneral: !hasMatches,
  });

  return answer || fallbackMessage(language);
};

