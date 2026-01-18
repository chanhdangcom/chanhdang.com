import { Metadata } from "next";
import { AccountPageClient } from "@/features/shop/components/account-page-client";

export const metadata: Metadata = {
  title: "Tài khoản | Cửa Hàng Phụ Kiện",
  description: "Quản lý tài khoản, theo dõi đơn hàng và cập nhật thông tin.",
};

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Tài khoản</h1>
        <p className="text-sm text-zinc-500">Quản lý thông tin và lịch sử mua hàng.</p>
      </div>
      <AccountPageClient />
    </div>
  );
}
