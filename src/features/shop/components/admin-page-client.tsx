"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Category, Order, OrderStatus, Product } from "../types";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrderStatusBadge } from "./order-status-badge";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/utils/cn";

type AdminPayload = {
  name: string;
  slug: string;
  price: string;
  stock: string;
  description: string;
  categorySlug: string;
  imageUrl: string;
};

export function AdminPageClient() {
  const { user, isLoading } = useUser();
  const params = useParams();
  const locale = (params?.locale as string) || "vi";
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminPayload>({
    name: "",
    slug: "",
    price: "",
    stock: "0",
    description: "",
    categorySlug: "",
    imageUrl: "",
  });
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [productQuery, setProductQuery] = useState("");
  const [productSort, setProductSort] = useState("newest");
  const [orderQuery, setOrderQuery] = useState("");
  const [orderSort, setOrderSort] = useState("newest");

  const processingCount = useMemo(
    () => orders.filter((order) => order.status === "processing").length,
    [orders]
  );

  const filteredProducts = useMemo(() => {
    const query = productQuery.trim().toLowerCase();
    const base = query
      ? products.filter((product) => {
          const name = product.name?.toLowerCase() ?? "";
          const slug = product.slug?.toLowerCase() ?? "";
          const category = product.categorySlug?.toLowerCase() ?? "";
          return (
            name.includes(query) ||
            slug.includes(query) ||
            category.includes(query)
          );
        })
      : [...products];

    const getTime = (value?: string | Date) =>
      value ? new Date(value).getTime() : 0;

    base.sort((a, b) => {
      switch (productSort) {
        case "oldest":
          return getTime(a.createdAt) - getTime(b.createdAt);
        case "price-desc":
          return (b.price ?? 0) - (a.price ?? 0);
        case "price-asc":
          return (a.price ?? 0) - (b.price ?? 0);
        case "stock-desc":
          return (b.stock ?? 0) - (a.stock ?? 0);
        case "stock-asc":
          return (a.stock ?? 0) - (b.stock ?? 0);
        case "name-asc":
          return (a.name ?? "").localeCompare(b.name ?? "");
        case "name-desc":
          return (b.name ?? "").localeCompare(a.name ?? "");
        default:
          return getTime(b.createdAt) - getTime(a.createdAt);
      }
    });

    return base;
  }, [products, productQuery, productSort]);

  const filteredOrders = useMemo(() => {
    const query = orderQuery.trim().toLowerCase();
    const base = query
      ? orders.filter((order) => {
          const orderNumber = order.orderNumber?.toLowerCase() ?? "";
          const userId = order.userId?.toLowerCase() ?? "";
          const items = order.items
            .map((item) => item.productName || item.productId || "")
            .join(" ")
            .toLowerCase();
          return (
            orderNumber.includes(query) ||
            userId.includes(query) ||
            items.includes(query)
          );
        })
      : [...orders];

    const getTime = (value?: string | Date) =>
      value ? new Date(value).getTime() : 0;

    base.sort((a, b) => {
      switch (orderSort) {
        case "oldest":
          return getTime(a.createdAt) - getTime(b.createdAt);
        case "total-desc":
          return (b.total ?? 0) - (a.total ?? 0);
        case "total-asc":
          return (a.total ?? 0) - (b.total ?? 0);
        default:
          return getTime(b.createdAt) - getTime(a.createdAt);
      }
    });

    return base;
  }, [orders, orderQuery, orderSort]);

  const orderStatusGroups = useMemo(() => {
    const statusOrder: Array<{ status: OrderStatus; label: string }> = [
      { status: "pending", label: "Chờ xác nhận" },
      { status: "paid", label: "Đã thanh toán" },
      { status: "processing", label: "Đang xử lý" },
      { status: "shipped", label: "Đang giao" },
      { status: "delivered", label: "Đã giao" },
      { status: "cancelled", label: "Đã hủy" },
      { status: "refunded", label: "Đã hoàn tiền" },
    ];

    const buckets = statusOrder.reduce<Record<OrderStatus, Order[]>>(
      (acc, item) => {
        acc[item.status] = [];
        return acc;
      },
      {} as Record<OrderStatus, Order[]>
    );

    filteredOrders.forEach((order) => {
      buckets[order.status]?.push(order);
    });

    return statusOrder.map((item) => ({
      ...item,
      items: buckets[item.status] ?? [],
    }));
  }, [filteredOrders]);

  const headers: HeadersInit = useMemo(() => {
    const base: Record<string, string> = { "Content-Type": "application/json" };
    if (user?.id) {
      base.Authorization = `Bearer ${user.id}`;
    }
    return base;
  }, [user?.id]);

  const handleUploadImage = async (file: File) => {
    setUploadError("");
    setIsUploading(true);
    try {
      const presignRes = await fetch(
        `/api/shop/upload-image?fileName=${encodeURIComponent(
          file.name
        )}&contentType=${encodeURIComponent(file.type)}`
      );
      const presignData = await presignRes.json();
      if (!presignRes.ok) {
        throw new Error(presignData.error || "Không lấy được URL upload");
      }

      const uploadRes = await fetch(presignData.presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!uploadRes.ok) {
        throw new Error("Upload ảnh thất bại");
      }

      setForm((prev) => ({ ...prev, imageUrl: presignData.publicUrl }));
    } catch (err) {
      setUploadError((err as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  const loadAdminData = useCallback(async () => {
    setIsBusy(true);
    setError("");
    try {
      const [productsRes, ordersRes, categoriesRes] = await Promise.all([
        fetch(`/api/shop/products`, { headers }),
        fetch(`/api/shop/orders?all=1`, { headers }),
        fetch(`/api/shop/categories`, { headers }),
      ]);

      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      const categoriesData = await categoriesRes.json();

      if (!productsRes.ok)
        throw new Error(productsData.error || "Không tải được sản phẩm");
      if (!ordersRes.ok)
        throw new Error(ordersData.error || "Không tải được đơn hàng");
      if (!categoriesRes.ok)
        throw new Error(categoriesData.error || "Không tải được danh mục");

      setProducts(productsData.items || []);
      setOrders(ordersData.items || []);
      setCategories(categoriesData.items || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsBusy(false);
    }
  }, [headers]);

  useEffect(() => {
    if (user?.role === "admin") {
      loadAdminData();
    }
  }, [user?.role, loadAdminData]);

  if (!isLoading && user?.role !== "admin") {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-black">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Bạn không có quyền truy cập trang quản trị.
        </p>
        <Button
          className="mt-4"
          onClick={() => window.location.assign(`/${locale}`)}
        >
          Quay về trang chủ
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            label: "Sản phẩm",
            value: products.length,
          },
          {
            label: "Đơn hàng",
            value: orders.length,
          },
          {
            label: "Đang xử lý",
            value: processingCount,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-zinc-200/70 bg-white/80 p-5 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-950/70"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              {item.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-white">
              {item.value}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-zinc-200/70 bg-white/80 p-6 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-950/70">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            {editingId ? "Cập nhật sản phẩm" : "Tạo sản phẩm mới"}
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            Điền đủ thông tin cơ bản để hiển thị đẹp trên cửa hàng.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Input
              placeholder="Tên sản phẩm"
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
            />
            <Input
              placeholder="Slug (tùy chọn)"
              value={form.slug}
              onChange={(event) =>
                setForm({ ...form, slug: event.target.value })
              }
            />
            <Input
              placeholder="Giá"
              value={form.price}
              onChange={(event) =>
                setForm({ ...form, price: event.target.value })
              }
            />
            <Input
              placeholder="Tồn kho"
              value={form.stock}
              onChange={(event) =>
                setForm({ ...form, stock: event.target.value })
              }
            />
            <Input
              placeholder="Danh mục (slug)"
              value={form.categorySlug}
              onChange={(event) =>
                setForm({ ...form, categorySlug: event.target.value })
              }
            />
            {categories.length > 0 && (
              <div className="md:col-span-2">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                  Chọn nhanh danh mục
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const isActive = form.categorySlug === category.slug;
                    return (
                      <button
                        key={category.id || category._id || category.slug}
                        type="button"
                        onClick={() =>
                          setForm({ ...form, categorySlug: category.slug })
                        }
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                          isActive
                            ? "border-zinc-900 bg-zinc-900 text-white shadow-sm shadow-zinc-900/20"
                            : "border-zinc-200/80 bg-white/70 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800/70 dark:bg-zinc-950/60 dark:text-zinc-300 dark:hover:border-zinc-700"
                        }`}
                      >
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <Input
              placeholder="Mô tả"
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
            />
            <Input
              placeholder="Ảnh sản phẩm (URL)"
              value={form.imageUrl}
              onChange={(event) =>
                setForm({ ...form, imageUrl: event.target.value })
              }
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) handleUploadImage(file);
              }}
            />
          </div>
          {uploadError && (
            <p className="mt-3 text-sm text-red-500">{uploadError}</p>
          )}
          <Button
            className="mt-4 rounded-full border border-zinc-900 bg-zinc-900 px-5 text-white hover:bg-zinc-800 dark:border-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            disabled={isBusy || isUploading}
            onClick={async () => {
              setIsBusy(true);
              setError("");
              try {
                const cleanedSlug = form.slug.trim();
                const payload = {
                  name: form.name,
                  ...(cleanedSlug ? { slug: cleanedSlug } : {}),
                  price: Number(form.price),
                  stock: Number(form.stock),
                  description: form.description,
                  shortDescription: form.description,
                  images: [
                    {
                      url: form.imageUrl || "/img/cover.jpg",
                      alt: form.name,
                    },
                  ],
                  categorySlug: form.categorySlug,
                };
                const res = await fetch(
                  editingId
                    ? `/api/shop/products/${editingId}`
                    : `/api/shop/products`,
                  {
                    method: editingId ? "PATCH" : "POST",
                    headers,
                    body: JSON.stringify(payload),
                  }
                );
                const data = await res.json();
                if (!res.ok)
                  throw new Error(
                    data.error ||
                      (editingId
                        ? "Cập nhật thất bại"
                        : "Tạo sản phẩm thất bại")
                  );
                await loadAdminData();
                setForm({
                  name: "",
                  slug: "",
                  price: "",
                  stock: "0",
                  description: "",
                  categorySlug: "",
                  imageUrl: "",
                });
                setEditingId(null);
              } catch (err) {
                setError((err as Error).message);
              } finally {
                setIsBusy(false);
              }
            }}
          >
            {editingId ? "Lưu thay đổi" : "Tạo sản phẩm"}
          </Button>
          {editingId && (
            <Button
              variant="outline"
              className="mt-3 rounded-full px-5"
              onClick={() => {
                setEditingId(null);
                setForm({
                  name: "",
                  slug: "",
                  price: "",
                  stock: "0",
                  description: "",
                  categorySlug: "",
                  imageUrl: "",
                });
              }}
            >
              Hủy chỉnh sửa
            </Button>
          )}
        </div>

        <div className="rounded-3xl border border-zinc-200/70 bg-white/80 p-6 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-950/70">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Tạo danh mục mới
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            Thêm danh mục để sản phẩm dễ lọc hơn.
          </p>
          <div className="mt-5 grid gap-4">
            <Input
              placeholder="Tên danh mục"
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
            />
            <Input
              placeholder="Slug danh mục"
              value={categorySlug}
              onChange={(event) => setCategorySlug(event.target.value)}
            />
          </div>
          {categories.length > 0 && (
            <div className="mt-4">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                Danh mục hiện có
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <span
                    key={category.id || category._id || category.slug}
                    className="rounded-full border border-zinc-200/80 bg-white/70 px-3 py-1.5 text-xs font-semibold text-zinc-600 shadow-sm shadow-black/5 dark:border-zinc-800/70 dark:bg-zinc-950/60 dark:text-zinc-300"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          <Button
            className="mt-4 rounded-full border border-zinc-900 bg-zinc-900 px-5 text-white hover:bg-zinc-800 dark:border-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            disabled={isBusy}
            onClick={async () => {
              setIsBusy(true);
              setError("");
              try {
                const res = await fetch(`/api/shop/categories`, {
                  method: "POST",
                  headers,
                  body: JSON.stringify({
                    name: categoryName,
                    slug: categorySlug,
                  }),
                });
                const data = await res.json();
                if (!res.ok)
                  throw new Error(data.error || "Tạo danh mục thất bại");
                await loadAdminData();
                setCategoryName("");
                setCategorySlug("");
              } catch (err) {
                setError((err as Error).message);
              } finally {
                setIsBusy(false);
              }
            }}
          >
            Tạo danh mục
          </Button>
          <Button
            variant="outline"
            className="mt-3 rounded-full px-5"
            disabled={isBusy}
            onClick={async () => {
              setIsBusy(true);
              setError("");
              try {
                const res = await fetch(`/api/shop/seed`, {
                  method: "POST",
                  headers,
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Seed thất bại");
                await loadAdminData();
              } catch (err) {
                setError((err as Error).message);
              } finally {
                setIsBusy(false);
              }
            }}
          >
            Seed dữ liệu mẫu
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Danh sách sản phẩm
          </h3>
          <span className="text-sm text-zinc-500">
            Tổng cộng {filteredProducts.length} sản phẩm
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Tìm theo tên, slug, danh mục..."
            value={productQuery}
            onChange={(event) => setProductQuery(event.target.value)}
            className="w-full sm:max-w-xs"
          />
          <select
            value={productSort}
            onChange={(event) => setProductSort(event.target.value)}
            className="rounded-full border border-zinc-200/80 bg-white/80 px-4 py-2 text-sm text-zinc-700 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-zinc-200/70 dark:border-zinc-800/70 dark:bg-zinc-950/60 dark:text-zinc-200 dark:focus:ring-zinc-800/70"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="price-desc">Giá cao - thấp</option>
            <option value="price-asc">Giá thấp - cao</option>
            <option value="stock-desc">Tồn kho cao - thấp</option>
            <option value="stock-asc">Tồn kho thấp - cao</option>
            <option value="name-asc">Tên A - Z</option>
            <option value="name-desc">Tên Z - A</option>
          </select>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {filteredProducts.map((product) => (
            <div
              key={product.id || product._id}
              className="rounded-2xl border border-zinc-200/70 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300/80 dark:border-zinc-800/70 dark:bg-zinc-950/70"
            >
              <div className="flex items-center gap-3">
                <img
                  src={product.images?.[0]?.url || "/img/cover.jpg"}
                  alt={product.images?.[0]?.alt || product.name}
                  className="size-20 rounded-xl object-cover"
                />
                <div>
                  <p className="text-sm text-zinc-500">
                    {product.categorySlug}
                  </p>
                  <h4 className="text-base font-semibold text-zinc-900 dark:text-white">
                    {product.name}
                  </h4>
                  <p className="text-sm text-zinc-500">
                    {product.price?.toLocaleString("vi-VN")}₫ · tồn kho{" "}
                    {product.stock}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingId(
                      product._id || product.id || product.slug || null
                    );
                    setForm({
                      name: product.name,
                      slug: product.slug || "",
                      price: String(product.price || 0),
                      stock: String(product.stock || 0),
                      description: product.description || "",
                      categorySlug: product.categorySlug || "",
                      imageUrl: product.images?.[0]?.url || "",
                    });
                  }}
                >
                  Sửa
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    const ok = window.confirm("Xóa sản phẩm này?");
                    if (!ok) return;
                    setIsBusy(true);
                    try {
                      await fetch(
                        `/api/shop/products/${product.slug || product.id || product._id}`,
                        {
                          method: "DELETE",
                          headers,
                        }
                      );
                      await loadAdminData();
                    } finally {
                      setIsBusy(false);
                    }
                  }}
                >
                  Xóa
                </Button>
                <Link
                  href={`/${locale}/CuaHangPhuKien/san-pham/${product.id || product._id}`}
                  className={cn(
                    buttonVariants({ size: "sm", variant: "ghost" })
                  )}
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Đơn hàng
          </h3>
          <span className="text-sm text-zinc-500">
            Đang xử lý {processingCount} đơn
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Tìm theo mã đơn, khách, sản phẩm..."
            value={orderQuery}
            onChange={(event) => setOrderQuery(event.target.value)}
            className="w-full sm:max-w-xs"
          />
          <select
            value={orderSort}
            onChange={(event) => setOrderSort(event.target.value)}
            className="rounded-full border border-zinc-200/80 bg-white/80 px-4 py-2 text-sm text-zinc-700 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-zinc-200/70 dark:border-zinc-800/70 dark:bg-zinc-950/60 dark:text-zinc-200 dark:focus:ring-zinc-800/70"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="total-desc">Giá trị cao - thấp</option>
            <option value="total-asc">Giá trị thấp - cao</option>
          </select>
        </div>
        <div className="space-y-6">
          {orderStatusGroups.some((group) => group.items.length > 0) ? (
            orderStatusGroups.map((group) => {
              if (group.items.length === 0) return null;
              return (
                <div key={group.status} className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <OrderStatusBadge status={group.status} />
                      <span className="text-sm text-zinc-500">
                        {group.items.length} đơn
                      </span>
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                      {group.label}
                    </span>
                  </div>
                  {group.items.map((order) => (
                    <div
                      key={order.id || order._id}
                      className="rounded-2xl border border-zinc-200/70 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300/80 dark:border-zinc-800/70 dark:bg-zinc-950/70"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-zinc-500">
                              {order.orderNumber}
                            </p>
                            <p className="text-base font-semibold text-zinc-900 dark:text-white">
                              {order.total.toLocaleString("vi-VN")}₫
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {order.items.slice(0, 3).map((item, index) => (
                              <div
                                key={`${order.id || order._id}-${item.productId}-${index}`}
                                className="flex items-center gap-2 rounded-2xl border border-zinc-200/80 bg-white/70 p-2 text-xs text-zinc-600 dark:border-zinc-800/70 dark:bg-zinc-950/60 dark:text-zinc-300"
                              >
                                <img
                                  src={item.image || "/img/cover.jpg"}
                                  alt={item.productName || "Sản phẩm"}
                                  className="size-20 rounded-xl object-cover"
                                />
                                <span className="max-w-[160px] truncate">
                                  {item.productName || item.productId}
                                </span>
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <span className="text-xs text-zinc-500">
                                +{order.items.length - 3} sản phẩm
                              </span>
                            )}
                          </div>
                        </div>
                        <OrderStatusBadge status={order.status} />
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/${locale}/CuaHangPhuKien/orders/${order.id || order._id || order.orderNumber}`}
                            className={cn(
                              buttonVariants({ size: "sm", variant: "ghost" })
                            )}
                          >
                            Xem chi tiết
                          </Link>
                          {["processing", "shipped", "delivered"].map(
                            (status) => (
                              <Button
                                key={status}
                                size="sm"
                                variant="outline"
                                onClick={async () => {
                                  setIsBusy(true);
                                  try {
                                    await fetch(
                                      `/api/shop/orders/${order.id || order._id}`,
                                      {
                                        method: "PATCH",
                                        headers,
                                        body: JSON.stringify({ status }),
                                      }
                                    );
                                    await loadAdminData();
                                  } finally {
                                    setIsBusy(false);
                                  }
                                }}
                              >
                                {status}
                              </Button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-200/80 bg-white/60 p-6 text-sm text-zinc-500 dark:border-zinc-800/70 dark:bg-zinc-950/60">
              Không có đơn hàng phù hợp với bộ lọc hiện tại.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
