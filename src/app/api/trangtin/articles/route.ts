import { NextResponse } from "next/server";
import { getUserRole } from "@/lib/auth-helpers";
import { requireAdmin } from "@/lib/permissions";
import { createArticle, getArticles } from "@/features/trangtin/lib/db";
import type { ArticleInput } from "@/features/trangtin/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category")?.trim();
    const search = searchParams.get("search")?.trim();
    const limit = Math.min(Number(searchParams.get("limit") || 50), 100);
    const publishedOnly = searchParams.get("all") !== "true";

    const articles = await getArticles({
      categorySlug: category || undefined,
      search: search || undefined,
      limit,
      publishedOnly,
    });

    return NextResponse.json({ items: articles });
  } catch (error) {
    console.error("[trangtin/articles:GET]", error);
    return NextResponse.json(
      { error: "Failed to load articles" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const role = await getUserRole(request);
    if (!requireAdmin(role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const payload = (await request.json()) as ArticleInput;
    if (!payload.title?.trim() || !payload.description?.trim()) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }
    if (!payload.content?.trim() || !payload.categorySlug?.trim()) {
      return NextResponse.json(
        { error: "Content and category are required" },
        { status: 400 }
      );
    }

    const article = await createArticle(payload);
    return NextResponse.json({ success: true, article });
  } catch (error) {
    console.error("[trangtin/articles:POST]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create article" },
      { status: 500 }
    );
  }
}
