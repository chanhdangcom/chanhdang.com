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

  const normalizedMessage = normalize(message);
  
  // Try to match against questions first (more accurate)
  const questionMatches = facts
    .flatMap((fact) => fact.questions.map((question) => ({ fact, question })))
    .map(({ fact, question }) => ({
      rating: diceCoefficient(normalize(question), normalizedMessage),
      fact,
      source: "question" as const,
    }))
    .filter((item) => item.rating > 0);

  // Also try to match against answer content (for more flexible matching)
  const answerMatches = facts
    .map((fact) => {
      const answerText = normalize(fact.answer);
      // Extract key phrases from answer (first 100 chars or first sentence)
      const keyPhrase = answerText.slice(0, 100);
      return {
        rating: diceCoefficient(keyPhrase, normalizedMessage) * 0.7, // Lower weight for answer matching
        fact,
        source: "answer" as const,
      };
    })
    .filter((item) => item.rating > 0);

  // Combine and sort by rating
  const allMatches = [...questionMatches, ...answerMatches].sort((a, b) => b.rating - a.rating);

  const best = allMatches[0];
  const threshold = 0.35; // Slightly lower threshold for better recall
  
  if (!best || best.rating < threshold) {
    return fallbackMessage(language);
  }

  // If we have a good match, return it
  return best.fact.answer;
};

export const buildLLMResponse = async (facts: FactRecord[], message: string, language = "vi") => {
  if (!hasLLMSupport()) {
    return null; // Let similarity matching handle it
  }

  // If no facts, still try to use Gemini with general knowledge
  if (!facts.length) {
    const answer = await generateAnswer({
      context: "Không có dữ liệu cá nhân trong database. Bạn có thể trả lời dựa trên kiến thức chung.",
      question: message,
      language,
      allowGeneral: true,
    });
    return answer || null;
  }

  // Try to get embeddings for similarity search
  let scoredFacts: Array<{ fact: FactRecord; score: number }> = [];
  let embeddingFailed = false;
  
  try {
    const queryEmbedding = await getEmbedding(message);
    const factsWithEmbeddings = facts.filter(
      (fact) => Array.isArray(fact.embedding) && fact.embedding.length > 0
    );
    
    if (factsWithEmbeddings.length === 0) {
      console.log("[response-service] No facts with embeddings, using fallback");
      embeddingFailed = true;
    } else {
      scoredFacts = factsWithEmbeddings
        .map((fact) => {
          try {
            const score = cosineSimilarity(queryEmbedding, fact.embedding ?? []);
            return { fact, score: Number.isFinite(score) ? score : 0 };
          } catch (err) {
            console.error("[response-service] Error calculating similarity:", err);
            return { fact, score: 0 };
          }
        })
        .filter((item) => item.score > 0);
    }
  } catch (error) {
    console.error("[response-service] Error getting embedding:", error);
    embeddingFailed = true;
  }
  
  // Fallback: use keyword-based similarity if embedding failed
  if (embeddingFailed || scoredFacts.length === 0) {
    console.log("[response-service] Using keyword-based similarity as fallback");
    // Use a simple keyword matching approach
    const normalizedQuery = message.toLowerCase();
    scoredFacts = facts
      .map((fact) => {
        const questionText = fact.questions.join(" ").toLowerCase();
        const answerText = fact.answer.toLowerCase();
        const tagsText = fact.tags?.join(" ").toLowerCase() || "";
        
        // Simple keyword overlap score
        const queryWords = normalizedQuery.split(/\s+/).filter((w) => w.length > 2);
        const allText = `${questionText} ${answerText} ${tagsText}`;
        const matches = queryWords.filter((word) => allText.includes(word)).length;
        const score = queryWords.length > 0 ? matches / queryWords.length : 0;
        
        return { fact, score };
      })
      .filter((item) => item.score > 0.2) // Lower threshold for keyword matching
      .sort((a, b) => b.score - a.score);
  }

  const topK = Number(process.env.RETRIEVAL_TOP_K || 5);
  const minRelevanceScore = Number(process.env.MIN_RELEVANCE_SCORE || 0.3);
  const hasMatches = scoredFacts.length > 0 && scoredFacts.some((item) => item.score >= minRelevanceScore);
  
  // Build context with better formatting and relevance information
  let context: string;
  
  if (hasMatches) {
    // Use only highly relevant facts
    const relevantFacts = scoredFacts
      .filter((item) => item.score >= minRelevanceScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
    
    context = relevantFacts
      .map(({ fact, score }, index) => {
        const relevance = score >= 0.7 ? "Rất liên quan" : score >= 0.5 ? "Liên quan" : "Có liên quan";
        return `[Thông tin ${index + 1} - ${relevance}]\n` +
          `Câu hỏi có thể: ${fact.questions.join(" / ")}\n` +
          `Nội dung: ${fact.answer}` +
          (fact.tags && fact.tags.length > 0 ? `\nChủ đề: ${fact.tags.join(", ")}` : "");
      })
      .join("\n\n---\n\n");
  } else if (facts.length > 0) {
    // Fallback: use top facts by similarity if embedding failed
    const topFacts = facts.slice(0, topK);
    context = topFacts
      .map((fact, index) => {
        return `[Thông tin ${index + 1}]\n` +
          `Câu hỏi có thể: ${fact.questions.join(" / ")}\n` +
          `Nội dung: ${fact.answer}` +
          (fact.tags && fact.tags.length > 0 ? `\nChủ đề: ${fact.tags.join(", ")}` : "");
      })
      .join("\n\n---\n\n");
  } else {
    context = "Không có dữ liệu cá nhân liên quan đến câu hỏi này trong database.";
  }

  const answer = await generateAnswer({
    context,
    question: message,
    language,
    allowGeneral: !hasMatches && facts.length === 0,
  });

  return answer || null;
};

