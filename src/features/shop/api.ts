import type { Cart, CartItem, Category, Order, Product } from "./types";

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data as T;
}

export async function fetchProducts(params?: Record<string, string>) {
  const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
  const res = await fetch(`/api/shop/products${qs}`, { cache: "no-store" });
  return handleResponse<{ items: Product[]; total: number; totalPages: number }>(res);
}

export async function fetchProduct(slug: string) {
  const res = await fetch(`/api/shop/products/${slug}`, { cache: "no-store" });
  return handleResponse<{ product: Product }>(res);
}

export async function fetchCategories() {
  const res = await fetch(`/api/shop/categories`, { cache: "no-store" });
  return handleResponse<{ items: Category[] }>(res);
}

function buildHeaders(userId?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (userId) {
    headers.Authorization = `Bearer ${userId}`;
  }
  return headers;
}

export async function fetchCart(userId?: string) {
  const res = await fetch(`/api/shop/cart`, {
    cache: "no-store",
    headers: buildHeaders(userId),
  });
  return handleResponse<Cart>(res);
}

export async function addToCart(item: CartItem, userId?: string) {
  const res = await fetch(`/api/shop/cart`, {
    method: "POST",
    headers: buildHeaders(userId),
    body: JSON.stringify({ ...item, userId }),
  });
  return handleResponse<Cart>(res);
}

export async function updateCart(items: CartItem[], discount = 0, userId?: string) {
  const res = await fetch(`/api/shop/cart`, {
    method: "PATCH",
    headers: buildHeaders(userId),
    body: JSON.stringify({ items, discount, userId }),
  });
  return handleResponse<Cart>(res);
}

export async function createOrder(payload: Partial<Order>, userId?: string) {
  const res = await fetch(`/api/shop/orders`, {
    method: "POST",
    headers: buildHeaders(userId),
    body: JSON.stringify(payload),
  });
  return handleResponse<{ success: boolean; orderId: string }>(res);
}

export async function fetchOrders(userId?: string) {
  const res = await fetch(`/api/shop/orders`, {
    cache: "no-store",
    headers: buildHeaders(userId),
  });
  return handleResponse<{ items: Order[] }>(res);
}

export async function fetchOrder(id: string, userId?: string) {
  const res = await fetch(`/api/shop/orders/${id}`, {
    cache: "no-store",
    headers: buildHeaders(userId),
  });
  return handleResponse<{ order: Order }>(res);
}
