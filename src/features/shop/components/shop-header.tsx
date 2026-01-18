import Link from "next/link";
import { ShoppingCart, User, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";

type ShopHeaderProps = {
  locale: string;
};

export function ShopHeader({ locale }: ShopHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/70 backdrop-blur-xl dark:border-zinc-800/70 dark:bg-black/60">
      <div className="container flex items-center justify-between gap-4 py-5">
        <Link
          href={`/${locale}/CuaHangPhuKien`}
          className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white"
        >
          Cửa Hàng Phụ Kiện
        </Link>
        <div className="hidden w-full max-w-xl items-center gap-2 rounded-full border border-zinc-200/70 bg-white/80 px-4 py-2 text-sm text-zinc-500 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-950/70 dark:text-zinc-400 md:flex">
          <Search className="h-4 w-4" />
          <span>Tìm kiếm phụ kiện, thương hiệu, mã sản phẩm...</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/CuaHangPhuKien/tra-cuu-don-hang`}
            className="hidden text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white md:block"
          >
            Tra cứu đơn
          </Link>
          <Link
            href={`/${locale}/CuaHangPhuKien/cart`}
            aria-label="Giỏ hàng"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>
          <Link
            href={`/${locale}/CuaHangPhuKien/account`}
            aria-label="Tài khoản"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
          >
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
