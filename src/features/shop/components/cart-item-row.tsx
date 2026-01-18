import Image from "next/image";
import type { CartItem } from "../types";
import { Button } from "@/components/ui/button";

type CartItemRowProps = {
  item: CartItem;
  onChange: (next: CartItem) => void;
  onRemove: () => void;
};

export function CartItemRow({ item, onChange, onRemove }: CartItemRowProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900">
          <Image
            src={item.image || "/img/cover.jpg"}
            alt={item.productName || "Sản phẩm"}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-base font-semibold text-zinc-900 dark:text-white">
            {item.productName}
          </p>
          <p className="text-sm text-zinc-500">{item.variant}</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {item.price.toLocaleString("vi-VN")}₫
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onChange({ ...item, quantity: Math.max(1, item.quantity - 1) })}
        >
          -
        </Button>
        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onChange({ ...item, quantity: item.quantity + 1 })}
        >
          +
        </Button>
        <Button variant="ghost" size="sm" onClick={onRemove}>
          Xóa
        </Button>
      </div>
    </div>
  );
}
