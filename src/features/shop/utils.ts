import type { CartItem, Product } from "./types";

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function calculateCartTotals(items: CartItem[], discount = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Math.max(subtotal - discount, 0);
  return { subtotal, total };
}

export function mapProductFromDb(product: Record<string, unknown>): Product {
  const images = Array.isArray(product.images)
    ? product.images.map((image) => ({
        url: String((image as { url?: string }).url ?? ""),
        alt: (image as { alt?: string }).alt,
      }))
    : [];

  return {
    _id: typeof product._id === "string" ? product._id : undefined,
    id: typeof product.id === "string" ? product.id : undefined,
    name: String(product.name ?? ""),
    slug: String(product.slug ?? ""),
    description: String(product.description ?? ""),
    shortDescription: product.shortDescription
      ? String(product.shortDescription)
      : undefined,
    price: Number(product.price ?? 0),
    salePrice: product.salePrice ? Number(product.salePrice) : undefined,
    images,
    categoryId: product.categoryId ? String(product.categoryId) : undefined,
    categorySlug: product.categorySlug ? String(product.categorySlug) : undefined,
    tags: Array.isArray(product.tags)
      ? product.tags.map((tag) => String(tag))
      : undefined,
    variants: Array.isArray(product.variants)
      ? product.variants.map((variant) => ({
          name: String((variant as { name?: string }).name ?? ""),
          options: Array.isArray((variant as { options?: unknown }).options)
            ? (variant as { options: unknown[] }).options.map((opt) => String(opt))
            : [],
        }))
      : undefined,
    specs: Array.isArray(product.specs)
      ? product.specs.map((spec) => ({
          label: String((spec as { label?: string }).label ?? ""),
          value: String((spec as { value?: string }).value ?? ""),
        }))
      : undefined,
    stock: Number(product.stock ?? 0),
    ratingAvg: product.ratingAvg ? Number(product.ratingAvg) : undefined,
    reviewCount: product.reviewCount ? Number(product.reviewCount) : undefined,
    isActive: product.isActive !== false,
    seo: product.seo
      ? {
          title: (product.seo as { title?: string }).title,
          description: (product.seo as { description?: string }).description,
          keywords: Array.isArray((product.seo as { keywords?: unknown }).keywords)
            ? (product.seo as { keywords: unknown[] }).keywords.map((item) => String(item))
            : undefined,
        }
      : undefined,
    createdAt: product.createdAt ? String(product.createdAt) : undefined,
    updatedAt: product.updatedAt ? String(product.updatedAt) : undefined,
  };
}
