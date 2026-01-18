import { Metadata } from "next";
import { AdminPageClient } from "@/features/shop/components/admin-page-client";

export const metadata: Metadata = {
  title: "Admin | Cửa Hàng Phụ Kiện",
  description: "Quản trị sản phẩm, danh mục và đơn hàng.",
};

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Quản trị cửa hàng
        </h1>
        <p className="text-sm text-zinc-500">
          Quản lý sản phẩm, danh mục và trạng thái đơn hàng.
        </p>
      </div>
      <AdminPageClient />
    </div>
  );
}
