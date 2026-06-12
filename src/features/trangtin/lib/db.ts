import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { normalizeDocument } from "@/lib/mongodb-helpers";
import { CATEGORIES, getCategoryBySlug } from "../constants";
import { SEED_ARTICLES } from "../data/seed";
import type { ArticleInput, NewsArticle } from "../types";
import { vietnameseSlug } from "../utils";

const COLLECTION = "trangtin_articles";

function mapArticle(doc: Record<string, unknown>): NewsArticle {
  const normalized = normalizeDocument(doc);
  return {
    id: normalized.id,
    title: String(doc.title ?? ""),
    slug: String(doc.slug ?? ""),
    description: String(doc.description ?? ""),
    content: String(doc.content ?? ""),
    categorySlug: String(doc.categorySlug ?? ""),
    categoryName: String(doc.categoryName ?? ""),
    coverImage: String(doc.coverImage ?? ""),
    author: String(doc.author ?? "Chanh Dang"),
    createdAt: doc.createdAt
      ? new Date(doc.createdAt as string | Date).toISOString()
      : new Date().toISOString(),
    updatedAt: doc.updatedAt
      ? new Date(doc.updatedAt as string | Date).toISOString()
      : new Date().toISOString(),
    isPublished: doc.isPublished !== false,
  };
}

async function getCollection() {
  const client = await clientPromise;
  return client.db("musicdb").collection(COLLECTION);
}

export async function ensureSeedArticles() {
  const collection = await getCollection();
  const existing = await collection.find({}, { projection: { slug: 1 } }).toArray();
  const existingSlugs = new Set(existing.map((doc) => String(doc.slug)));

  const missing = SEED_ARTICLES.filter((article) => {
    const slug = article.slug || vietnameseSlug(article.title);
    return !existingSlugs.has(slug);
  });

  if (missing.length === 0) return;

  const now = new Date();
  const docs = missing.map((article, index) => {
    const category = getCategoryBySlug(article.categorySlug);
    const createdAt = new Date(now.getTime() - index * 86400000);
    return {
      title: article.title,
      slug: article.slug || vietnameseSlug(article.title),
      description: article.description,
      content: article.content,
      categorySlug: article.categorySlug,
      categoryName: category?.name ?? article.categorySlug,
      coverImage:
        article.coverImage ||
        "https://cdn.chanhdang.com/ncdang_cover_2.jpg",
      author: article.author || "Chanh Dang",
      isPublished: article.isPublished !== false,
      createdAt,
      updatedAt: createdAt,
    };
  });

  await collection.insertMany(docs);
}

export async function getArticles(options?: {
  categorySlug?: string;
  search?: string;
  limit?: number;
  publishedOnly?: boolean;
}): Promise<NewsArticle[]> {
  await ensureSeedArticles();
  const collection = await getCollection();

  const filter: Record<string, unknown> = {};
  if (options?.publishedOnly !== false) {
    filter.isPublished = { $ne: false };
  }
  if (options?.categorySlug) {
    filter.categorySlug = options.categorySlug;
  }
  if (options?.search) {
    const regex = new RegExp(options.search, "i");
    filter.$or = [
      { title: regex },
      { description: regex },
      { content: regex },
      { categoryName: regex },
    ];
  }

  const cursor = collection
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(options?.limit ?? 100);

  const docs = await cursor.toArray();
  return docs.map((doc) => mapArticle(doc as Record<string, unknown>));
}

export async function getArticleBySlug(slug: string): Promise<NewsArticle | null> {
  await ensureSeedArticles();
  const collection = await getCollection();
  const doc = await collection.findOne({ slug, isPublished: { $ne: false } });
  return doc ? mapArticle(doc as Record<string, unknown>) : null;
}

export async function getArticleById(id: string): Promise<NewsArticle | null> {
  if (!ObjectId.isValid(id)) return null;
  const collection = await getCollection();
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  return doc ? mapArticle(doc as Record<string, unknown>) : null;
}

export async function createArticle(input: ArticleInput): Promise<NewsArticle> {
  const collection = await getCollection();
  const category = getCategoryBySlug(input.categorySlug);
  if (!category) {
    throw new Error("Invalid category");
  }

  const slug = input.slug?.trim() || vietnameseSlug(input.title);
  const exists = await collection.findOne({ slug });
  const finalSlug = exists
    ? `${slug}-${Math.random().toString(36).slice(2, 6)}`
    : slug;

  const now = new Date();
  const doc = {
    title: input.title.trim(),
    slug: finalSlug,
    description: input.description.trim(),
    content: input.content.trim(),
    categorySlug: input.categorySlug,
    categoryName: category.name,
    coverImage:
      input.coverImage?.trim() ||
      "https://cdn.chanhdang.com/ncdang_cover_2.jpg",
    author: input.author?.trim() || "Chanh Dang",
    isPublished: input.isPublished !== false,
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(doc);
  return mapArticle({ ...doc, _id: result.insertedId });
}

export async function updateArticle(
  id: string,
  input: Partial<ArticleInput>
): Promise<NewsArticle | null> {
  if (!ObjectId.isValid(id)) return null;
  const collection = await getCollection();

  const update: Record<string, unknown> = { updatedAt: new Date() };
  if (input.title) update.title = input.title.trim();
  if (input.description) update.description = input.description.trim();
  if (input.content) update.content = input.content.trim();
  if (input.coverImage !== undefined) update.coverImage = input.coverImage.trim();
  if (input.author) update.author = input.author.trim();
  if (input.isPublished !== undefined) update.isPublished = input.isPublished;
  if (input.slug) update.slug = input.slug.trim();

  if (input.categorySlug) {
    const category = getCategoryBySlug(input.categorySlug);
    if (!category) throw new Error("Invalid category");
    update.categorySlug = input.categorySlug;
    update.categoryName = category.name;
  }

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: update },
    { returnDocument: "after" }
  );

  return result ? mapArticle(result as Record<string, unknown>) : null;
}

export async function deleteArticle(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const collection = await getCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

export function getAllCategories() {
  return CATEGORIES;
}
