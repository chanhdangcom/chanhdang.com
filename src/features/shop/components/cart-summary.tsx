import { Button } from "@/components/ui/button";

type CartSummaryProps = {
  subtotal: number;
  discount: number;
  total: number;
  onCheckout?: () => void;
};

export function CartSummary({ subtotal, discount, total, onCheckout }: CartSummaryProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-black">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
        Tóm tắt đơn hàng
      </h3>
      <div className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
        <div className="flex items-center justify-between">
          <span>Tạm tính</span>
          <span>{subtotal.toLocaleString("vi-VN")}₫</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Giảm giá</span>
          <span>-{discount.toLocaleString("vi-VN")}₫</span>
        </div>
        <div className="flex items-center justify-between text-base font-semibold text-zinc-900 dark:text-white">
          <span>Tổng cộng</span>
          <span>{total.toLocaleString("vi-VN")}₫</span>
        </div>
      </div>
      {onCheckout && (
        <Button className="mt-6 w-full" onClick={onCheckout}>
          Thanh toán ngay
        </Button>
      )}
    </div>
  );
}
