import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

type SuggestionItem = { value: string; count: number };
type SuggestionStat = SuggestionItem & { latestIndex: number };

const normalizeList = (value?: string | null) =>
  (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const buildSuggestions = (values: Array<{ value: string; index: number }>) => {
  const counts = new Map<string, SuggestionStat>();

  values.forEach(({ value, index }) => {
    const key = value.trim().toLowerCase();
    if (!key) return;
    const existing = counts.get(key);
    if (existing) {
      existing.count += 1;
      existing.latestIndex = Math.min(existing.latestIndex, index);
    } else {
      counts.set(key, { value: value.trim(), count: 1, latestIndex: index });
    }
  });

  return Array.from(counts.values())
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.latestIndex - b.latestIndex;
    })
    .map(({ value, count }) => ({ value, count }));
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limitParam = searchParams.get("limit");

    if (!userId) {
      return NextResponse.json({ error: "Thiếu userId" }, { status: 400 });
    }

    const limit = Math.max(
      20,
      Math.min(300, Number.isFinite(Number(limitParam)) ? Number(limitParam) : 120)
    );

    const client = await clientPromise;
    const db = client.db("musicdb");

    const historyItems = await db
      .collection("history")
      .find({ userId })
      .sort({ playedAt: -1 })
      .limit(limit)
      .project({ musicData: 1 })
      .toArray();

    const topics: Array<{ value: string; index: number }> = [];
    const types: Array<{ value: string; index: number }> = [];
    const singers: Array<{ value: string; index: number }> = [];

    historyItems.forEach((item, index) => {
      const topicValue = item?.musicData?.topic;
      const typeValue = item?.musicData?.type;
      const singerValue = item?.musicData?.singer;

      if (topicValue) {
        normalizeList(topicValue).forEach((value) =>
          topics.push({ value, index })
        );
      }
      if (typeValue) {
        types.push({ value: String(typeValue).trim(), index });
      }
      if (singerValue) {
        normalizeList(String(singerValue)).forEach((value) =>
          singers.push({ value, index })
        );
      }
    });

    const topicSuggestions = buildSuggestions(topics).slice(0, 6);
    const typeSuggestions = buildSuggestions(types).slice(0, 6);
    const singerSuggestions = buildSuggestions(singers).slice(0, 6);

    return NextResponse.json({
      topics: topicSuggestions,
      types: typeSuggestions,
      singers: singerSuggestions,
      totalPlays: historyItems.length,
    });
  } catch (error) {
    console.error("[history-suggest] error:", error);
    return NextResponse.json({ error: "Failed to suggest from history" }, { status: 500 });
  }
}
