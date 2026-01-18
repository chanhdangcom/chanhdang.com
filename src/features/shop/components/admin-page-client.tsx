"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Order, Product } from "../types";
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
      const [productsRes, ordersRes] = await Promise.all([
        fetch(`/api/shop/products`, { headers }),
        fetch(`/api/shop/orders?all=1`, { headers }),
      ]);

      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();

      if (!productsRes.ok)
        throw new Error(productsData.error || "Không tải được sản phẩm");
      if (!ordersRes.ok)
        throw new Error(ordersData.error || "Không tải được đơn hàng");

      setProducts(productsData.items || []);
      setOrders(ordersData.items || []);
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

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            {editingId ? "Cập nhật sản phẩm" : "Tạo sản phẩm mới"}
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
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
            className="mt-4"
            disabled={isBusy || isUploading}
            onClick={async () => {
              setIsBusy(true);
              setError("");
              try {
                const payload = {
                  name: form.name,
                  slug: form.slug,
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
              className="mt-3"
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

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Tạo danh mục mới
          </h3>
          <div className="mt-4 grid gap-4">
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
          <Button
            className="mt-4"
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
            className="mt-3"
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
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Danh sách sản phẩm
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {products.map((product) => (
            <div
              key={product.id || product._id}
              className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black"
            >
              <p className="text-sm text-zinc-500">{product.categorySlug}</p>
              <h4 className="text-base font-semibold text-zinc-900 dark:text-white">
                {product.name}
              </h4>
              <p className="text-sm text-zinc-500">
                {product.price?.toLocaleString("vi-VN")}₫ · tồn kho{" "}
                {product.stock}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingId(
                      product.slug || product.id || product._id || null
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
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Đơn hàng
        </h3>
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id || order._id}
              className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-zinc-500">{order.orderNumber}</p>
                  <p className="text-xl text-zinc-900 dark:text-white">
                    {order.items
                      .map((item) => item.productName || item.productId)
                      .filter(Boolean)
                      .slice(0, 3)
                      .join(", ")}
                    {order.items.length > 3 ? "..." : ""}
                  </p>
                  <p className="text-base font-semibold text-zinc-900 dark:text-white">
                    {order.total.toLocaleString("vi-VN")}₫
                  </p>
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
                  {["processing", "shipped", "delivered"].map((status) => (
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
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
