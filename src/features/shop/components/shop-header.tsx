"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ShoppingCart, User, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { useUser } from "@/hooks/use-user";
import { fetchCart } from "../api";

type ShopHeaderProps = {
  locale: string;
};

export function ShopHeader({ locale }: ShopHeaderProps) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") ?? "";
  const [query, setQuery] = useState(currentSearch);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setQuery(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    if (!user || isLoading) {
      setCartCount(0);
      return;
    }
    let isActive = true;
    fetchCart(user.id)
      .then((cart) => {
        if (!isActive) return;
        const count = (cart.items || []).reduce(
          (total, item) => total + item.quantity,
          0
        );
        setCartCount(count);
      })
      .catch(() => {
        if (!isActive) return;
        setCartCount(0);
      });

    return () => {
      isActive = false;
    };
  }, [user, isLoading, pathname]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    const nextQuery = query.trim();

    if (nextQuery) {
      params.set("search", nextQuery);
    } else {
      params.delete("search");
    }

    const nextSearch = params.toString();
    router.push(nextSearch ? `${pathname}?${nextSearch}` : pathname);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/70 backdrop-blur-xl dark:border-zinc-800/70 dark:bg-black/60">
      <div className="container flex items-center justify-between gap-4 py-5">
        <Link
          href={`/${locale}/CuaHangPhuKien`}
          className="flex items-center gap-2 text-2xl font-medium tracking-tight text-zinc-400"
        >
          <img
            src="/img/Logo_Phuoc.png"
            className="h-auto w-20 bg-cover"
            alt="logo"
          />

          <div>Store</div>
        </Link>
        <form
          className="hidden w-full max-w-xl items-center gap-2 rounded-full border border-zinc-200/70 bg-white/80 px-4 py-2 text-sm text-zinc-500 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-950/70 dark:text-zinc-400 md:flex"
          onSubmit={handleSubmit}
        >
          <Search className="h-4 w-4" />
          <input
            type="search"
            name="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm kiếm phụ kiện, thương hiệu, mã sản phẩm..."
            aria-label="Tìm kiếm sản phẩm"
            className="w-full bg-transparent text-sm text-zinc-700 outline-none placeholder:text-zinc-400 dark:text-zinc-200 dark:placeholder:text-zinc-500"
          />
          <button type="submit" className="sr-only">
            Tìm kiếm
          </button>
        </form>
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/CuaHangPhuKien/tra-cuu-don-hang`}
            className="hidden items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white md:inline-flex"
          >
            <Search className="h-4 w-4" />
            Tra cứu đơn
          </Link>
          <a
            href="https://www.facebook.com/profile.php?id=61586165258200"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white md:inline-flex"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4 fill-current"
            >
              <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5A3.5 3.5 0 0 1 14.3 6h2.2v3h-2.2a1 1 0 0 0-1 1V12H16.5l-.5 3H13.3v7A10 10 0 0 0 22 12z" />
            </svg>
            Liên hệ
          </a>
          <Link
            href={`/${locale}/CuaHangPhuKien/cart`}
            aria-label="Giỏ hàng"
            className={cn(
              "relative",
              buttonVariants({ variant: "ghost", size: "icon" })
            )}
          >
            <ShoppingCart className="size-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-zinc-900 p-1 text-center text-xs font-semibold text-white dark:bg-white dark:text-zinc-900">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
          <Link
            href={`/${locale}/CuaHangPhuKien/account`}
            aria-label="Tài khoản"
            className={cn(
              "max-w-[140px] truncate",
              buttonVariants({ variant: "ghost" })
            )}
          >
            {user ? (
              <span className="truncate text-sm font-medium text-zinc-700 dark:text-zinc-200">
                {user.displayName || user.username}
              </span>
            ) : (
              <User className="h-5 w-5" />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
