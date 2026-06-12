"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/use-user";
import { useIsAdmin } from "@/hooks/use-permissions";
import { CATEGORIES } from "../constants";
import type { NewsArticle } from "../types";
import { formatDate } from "../utils";

type FormState = {
  title: string;
  slug: string;
  description: string;
  content: string;
  categorySlug: string;
  coverImage: string;
  author: string;
  isPublished: boolean;
};

const emptyForm: FormState = {
  title: "",
  slug: "",
  description: "",
  content: "",
  categorySlug: CATEGORIES[0]?.slug ?? "cong-nghe",
  coverImage: "",
  author: "Chanh Dang",
  isPublished: true,
};

export function AdminPageClient() {
  const { isLoading } = useUser();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const loadArticles = useCallback(async () => {
    const res = await fetch("/api/trangtin/articles?all=true");
    const data = await res.json();
    setArticles(data.items || []);
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadArticles();
    }
  }, [isAdmin, loadArticles]);

  useEffect(() => {
    if (!isLoading && !isAdminLoading && !isAdmin) {
      router.replace(`/${locale}/trangtin`);
    }
  }, [isAdmin, isAdminLoading, isLoading, locale, router]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsBusy(true);

    try {
      const url = editingId
        ? `/api/trangtin/articles/${editingId}`
        : "/api/trangtin/articles";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Action failed");
        return;
      }

      resetForm();
      await loadArticles();
    } catch {
      setError("Cannot connect to server");
    } finally {
      setIsBusy(false);
    }
  };

  const handleEdit = (article: NewsArticle) => {
    setEditingId(article.id);
    setForm({
      title: article.title,
      slug: article.slug,
      description: article.description,
      content: article.content,
      categorySlug: article.categorySlug,
      coverImage: article.coverImage,
      author: article.author,
      isPublished: article.isPublished,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    setIsBusy(true);
    try {
      const res = await fetch(`/api/trangtin/articles/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Delete failed");
        return;
      }
      if (editingId === id) resetForm();
      await loadArticles();
    } finally {
      setIsBusy(false);
    }
  };

  const getCategoryLabel = (slug: string) =>
    CATEGORIES.find((cat) => cat.slug === slug)?.name ?? slug;

  if (isLoading || isAdminLoading) {
    return <p className="text-sm text-zinc-500">Loading...</p>;
  }

  if (!isAdmin) {
    return (
      <p className="text-sm text-zinc-500">
        You need admin access to view this page.{" "}
        <Link href={`/${locale}/auth/login`} className="underline">
          Log in
        </Link>
      </p>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 border border-dashed border-zinc-200 p-6 dark:border-zinc-800"
      >
        <div>
          <h2 className="font-mono text-xl font-semibold">
            {editingId ? "Edit article" : "Add new article"}
          </h2>
          <p className="font-mono text-sm text-zinc-500">Manage news content</p>
        </div>

        <Input
          placeholder="Title *"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <Input
          placeholder="Slug (optional)"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
        />
        <Input
          placeholder="Short description *"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <textarea
          placeholder="Article content *"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
          rows={8}
          className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 font-mono text-sm dark:border-zinc-800"
        />
        <select
          value={form.categorySlug}
          onChange={(e) => setForm({ ...form, categorySlug: e.target.value })}
          className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 font-mono text-sm dark:border-zinc-800"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
        <Input
          placeholder="Cover image URL"
          value={form.coverImage}
          onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
        />
        <Input
          placeholder="Author"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) =>
              setForm({ ...form, isPublished: e.target.checked })
            }
          />
          Published
        </label>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-2">
          <Button type="submit" disabled={isBusy}>
            {editingId ? "Update" : "Create article"}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div className="mt-8 space-y-4">
        <h2 className="font-mono text-xl font-semibold">
          Articles ({articles.length})
        </h2>
        <ul className="space-y-3">
          {articles.map((article) => (
            <li
              key={article.id}
              className="border border-dashed border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{article.title}</p>
                  <p className="text-xs text-zinc-500">
                    {getCategoryLabel(article.categorySlug)} ·{" "}
                    {formatDate(article.createdAt, "en")}
                    {!article.isPublished && " · Hidden"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(article)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(article.id)}
                    disabled={isBusy}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
