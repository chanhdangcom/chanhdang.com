/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MotionHeaderMusic } from "./component/motion-header-music";
import { MenuBar } from "./menu-bar";
import { BackButton } from "./component/back-button";
import { usePremium } from "@/hooks/use-premium";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  CreditCard,
  HighDefinition,
  BookmarksSimple,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import { useTheme } from "next-themes";

const PRICE_MONTHLY_VND = "29.000";
const PRICE_MONTHLY_PRO_VND = "49.000";

export function PremiumPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = (params?.locale as string) || "vi";
  const basePath = `/${locale}/music`;
  const { isPremium, setPremium } = usePremium();
  const { theme } = useTheme();

  // Sau khi thanh toán Polar redirect về ?success=1 -> kích hoạt premium (demo: localStorage)
  useEffect(() => {
    const success = searchParams.get("success");
    if (success === "1") {
      setPremium(true);
      window.history.replaceState({}, "", `${basePath}/premium`);
    }
  }, [searchParams, setPremium, basePath]);

  return (
    <div className="flex font-apple">
      <MotionHeaderMusic />

      <MenuBar />

      <div className="mx-4 mt-16 w-full md:ml-[270px] md:mt-8">
        <div className="relative z-10">
          <BackButton />

          <div className="flex h-full flex-col gap-8 pb-36">
            <div className="relative flex flex-col items-center gap-4 rounded-3xl border border-rose-500/40 bg-zinc-100 p-4 pt-6 shadow-sm dark:bg-zinc-950">
              <div className="absolute -top-4 rounded-xl bg-rose-500 px-6 py-1 text-center text-sm font-semibold text-white dark:bg-rose-600">
                Upgrade
              </div>

              <h1 className="text-center">
                {theme === "dark" ? (
                  <img
                    src="/img/logo/Logotype Premium (Dark).svg"
                    alt="Polar"
                    className="w-32"
                  />
                ) : (
                  <img
                    src="/img/logo/Logotype Premium (Light).svg"
                    alt="Polar"
                    className="w-28"
                  />
                )}
              </h1>

              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center text-center text-3xl font-semibold tabular-nums text-rose-500 dark:text-rose-600">
                  {PRICE_MONTHLY_VND}

                  <span className="ml-1 text-lg font-normal text-zinc-500">
                    đ / month
                  </span>
                </div>

                <p className="space-y-4 text-sm">
                  <p className="flex items-center gap-1 font-medium">
                    <HighDefinition
                      weight="fill"
                      className="text-rose-500 dark:text-rose-600"
                      size={23}
                    />
                    <div>Unlimited listening, high quality.</div>
                  </p>

                  <p className="flex items-center gap-1 font-medium">
                    <BookmarksSimple
                      weight="fill"
                      className="text-rose-500 dark:text-rose-600"
                      size={23}
                    />
                    <div>Use library.</div>
                  </p>

                  <p className="flex items-center gap-1 font-medium">
                    <CreditCard
                      weight="fill"
                      className="text-rose-500 dark:text-rose-600"
                      size={23}
                    />
                    <div>Support platform development fee.</div>
                  </p>
                </p>

                <div className="flex h-full flex-col gap-4">
                  {isPremium ? (
                    <div className="flex items-center justify-center gap-1 text-center text-sm font-medium text-zinc-500">
                      <CheckCircle
                        size={24}
                        weight="fill"
                        className="text-green-700"
                      />

                      <div> You are on this plan</div>
                    </div>
                  ) : (
                    <Link
                      href={`${basePath}/checkout`}
                      className="text-center text-sm font-medium text-zinc-500"
                    >
                      <Button className="dark:rose-600 w-full rounded-xl bg-rose-500 text-white hover:opacity-90 dark:bg-rose-600">
                        Buy Now
                      </Button>
                    </Link>
                  )}

                  <p className="text-balance text-center text-xs text-zinc-500">
                    Polar supports card and QR code payments. To use VNPay/Momo
                    directly, configure it further in the Polar Dashboard or
                    integrate a Vietnamese gateway.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative flex flex-col items-center gap-4 rounded-3xl border border-amber-500/40 bg-zinc-100 p-4 pt-6 shadow-sm dark:bg-zinc-950">
              <div className="absolute -top-4 rounded-xl bg-gradient-to-r from-[#b38728] via-[#fcf6ba] to-[#aa771c] px-6 py-1 text-center text-sm font-semibold text-white shadow-[0_2px_8px_rgba(212,175,55,0.3)] dark:bg-rose-600">
                Upgrade
              </div>

              <h1 className="flex items-center text-center">
                {theme === "dark" ? (
                  <img
                    src="/img/logo/Logotype Premium (Dark).svg"
                    alt="Polar"
                    className="w-32"
                  />
                ) : (
                  <img
                    src="/img/logo/Logotype Premium (Light).svg"
                    alt="Polar"
                    className="w-28"
                  />
                )}

                <div className="mt-2 font-semibold text-amber-400 dark:text-amber-500">
                  Gold
                </div>
              </h1>

              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center text-center text-3xl font-semibold tabular-nums text-amber-400 dark:text-amber-500">
                  {PRICE_MONTHLY_PRO_VND}

                  <span className="ml-1 text-lg font-normal text-zinc-500">
                    đ / month
                  </span>
                </div>

                <p className="space-y-4 text-sm">
                  <p className="flex items-center gap-1 font-medium">
                    <HighDefinition
                      weight="fill"
                      className="text-amber-400 dark:text-amber-500"
                      size={23}
                    />
                    <div>Unlimited listening, high quality.</div>
                  </p>

                  <p className="flex items-center gap-1 font-medium">
                    <BookmarksSimple
                      weight="fill"
                      className="text-amber-400 dark:text-amber-500"
                      size={23}
                    />
                    <div>Use library.</div>
                  </p>

                  <p className="flex items-center gap-1 font-medium">
                    <UsersThree
                      weight="fill"
                      className="text-amber-400 dark:text-amber-500"
                      size={23}
                    />
                    <div>Start creating a music channel.</div>
                  </p>

                  <p className="flex items-center gap-1 font-medium">
                    <CreditCard
                      weight="fill"
                      className="text-amber-400 dark:text-amber-500"
                      size={23}
                    />
                    <div>Support platform development fee.</div>
                  </p>
                </p>

                <div className="flex flex-col gap-4">
                  {isPremium ? (
                    <div className="flex items-center justify-center gap-1 text-center text-sm font-medium text-zinc-500">
                      <CheckCircle
                        size={24}
                        weight="fill"
                        className="text-green-700"
                      />

                      <div> You are on this plan</div>
                    </div>
                  ) : (
                    <Link
                      href={`${basePath}/checkout`}
                      className="text-center text-sm font-semibold"
                    >
                      <Button className="w-full rounded-xl border-none bg-gradient-to-tr from-[#996515] via-[#F1E5AC] to-[#D4AF37] shadow-[0_4px_15px_0_rgba(212,175,55,0.4)] hover:brightness-110 dark:bg-gradient-to-tr dark:from-[#996515] dark:via-[#F1E5AC] dark:to-[#D4AF37]">
                        Buy Now
                      </Button>
                    </Link>
                  )}

                  <p className="text-balance text-center text-xs text-zinc-500">
                    Polar supports card and QR code payments. To use VNPay/Momo
                    directly, configure it further in the Polar Dashboard or
                    integrate a Vietnamese gateway.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
