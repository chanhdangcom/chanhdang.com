import clientPromise from "@/lib/mongodb";
import type { FactRecord } from "./types";

const COLLECTION = process.env.NCDANG_BOT_COLLECTION ?? "facts";
const CACHE_TTL_MS = Number(process.env.NCDANG_BOT_CACHE_TTL ?? 1000 * 60); // 1 minute default

type CachedFacts = {
  timestamp: number;
  facts: FactRecord[];
};

const cache = new Map<string, CachedFacts>();

const normalizeLanguage = (language?: string) =>
  (language?.trim() || process.env.NCDANG_BOT_DEFAULT_LANGUAGE || "vi").toLowerCase();

export async function fetchFacts(language?: string): Promise<FactRecord[]> {
  const lang = normalizeLanguage(language);
  const cached = cache.get(lang);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.facts;
  }

  const client = await clientPromise;
  const dbName = process.env.NCDANG_BOT_DB || process.env.MONGODB_DB;
  const db = dbName ? client.db(dbName) : client.db();

  const docs = await db
    .collection(COLLECTION)
    .find({ language: lang })
    .toArray();

  const facts: FactRecord[] = docs.map((doc) => ({
    questions: Array.isArray(doc.questions) ? doc.questions : [],
    answer: typeof doc.answer === "string" ? doc.answer : "",
    tags: Array.isArray(doc.tags) ? doc.tags : [],
    language: typeof doc.language === "string" ? doc.language : lang,
    embedding: Array.isArray(doc.embedding) ? doc.embedding : undefined,
  }));

  cache.set(lang, { timestamp: Date.now(), facts });
  return facts;
}

