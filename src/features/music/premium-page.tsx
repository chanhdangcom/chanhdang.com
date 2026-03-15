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
  NotSupersetOf,
} from "@phosphor-icons/react/dist/ssr";
import { useTheme } from "next-themes";
import { ChanhdangLogotypeMusic } from "@/components/chanhdang-logotype-music";
import { BgLogo } from "./component/bg-logo";

const FREE_PLAN = "Free";
const PRICE_MONTHLY_VND = "29.000";
const PRICE_MONTHLY_PRO_VND = "49.000";

const PREMIUM_LOGO_LIGHT = "/img/logo/Logotype Premium (Light).svg";
const PREMIUM_LOGO_DARK = "/img/logo/Logotype Premium (Dark).svg";

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

      <div className="relative mx-4 mt-16 min-h-screen w-full md:ml-[270px] md:mt-8">
        <BgLogo
          logos={
            (theme ?? "light") === "dark"
              ? [PREMIUM_LOGO_DARK]
              : [PREMIUM_LOGO_LIGHT]
          }
          opacity={theme === "dark" ? 0.1 : 0.15}
        />

        <div className="relative z-10">
          <BackButton />

          <div className="mb-8 space-y-2 text-center font-apple">
            <div className="text-3xl font-semibold"> Plans & pricing</div>

            <div className="text-balance text-sm text-zinc-500">
              The Free plan offers ad-free listening at no cost, while Premium
              adds high-quality audio and library access for 29,000 VND, and the
              Premium Creator tier includes all features plus the ability to
              start a music channel for 49,000 VND.
            </div>
          </div>

          <div className="justify-between gap-4 space-y-8 pb-36 md:flex md:space-y-0">
            <div className="relative flex w-full flex-col items-center gap-4 rounded-3xl border border-zinc-200 bg-zinc-100 p-4 pt-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="absolute -top-4 rounded-xl bg-zinc-400 px-6 py-1 text-center text-sm font-semibold text-white">
                Free
              </div>

              <ChanhdangLogotypeMusic height={28} className="w-auto" />

              <div className="z-10 flex flex-col items-center justify-center space-y-4">
                <div className="flex items-end gap-1 text-center text-3xl font-semibold tabular-nums text-zinc-500">
                  {FREE_PLAN}
                </div>

                <p className="space-y-4 text-sm">
                  <p className="flex items-center gap-1 font-medium">
                    <NotSupersetOf
                      weight="fill"
                      className="text-rose-500 dark:text-rose-600"
                      size={23}
                    />
                    <div>No ad interruptions.</div>
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
                    <div className="flex items-center justify-center gap-1 text-center text-sm font-medium text-zinc-500">
                      <CheckCircle
                        size={24}
                        weight="fill"
                        className="text-green-700"
                      />

                      <div> You are on this plan</div>
                    </div>
                  )}

                  <p className="text-balance text-center text-xs text-zinc-500">
                    Enjoy uninterrupted music at zero cost. Our Free Plan offers
                    an ad-free experience.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative flex w-full flex-col items-center gap-4 rounded-3xl border border-rose-500/40 bg-zinc-100 p-4 pt-6 shadow-sm dark:bg-zinc-950">
              <div className="absolute -top-4 rounded-xl bg-rose-500 px-6 py-1 text-center text-sm font-semibold text-white dark:bg-rose-600">
                Upgrade
              </div>

              <h1 className="text-center">
                {theme === "dark" ? (
                  <img
                    src="/img/logo/Logotype Premium (Dark).svg"
                    alt="Polar"
                    className="w-28"
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
                <div className="flex items-end gap-1 text-center text-3xl font-semibold tabular-nums text-rose-500 dark:text-rose-600">
                  <div className="flex items-end gap-1 text-center text-3xl font-semibold tabular-nums text-rose-500 dark:text-rose-600">
                    {PRICE_MONTHLY_VND} VND
                  </div>
                </div>

                <p className="space-y-4 text-sm">
                  <p className="flex items-center gap-1 font-medium">
                    <NotSupersetOf
                      weight="fill"
                      className="text-rose-500 dark:text-rose-600"
                      size={23}
                    />
                    <div>No ad interruptions.</div>
                  </p>

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
                    <p className="flex items-center justify-center gap-1 font-medium">
                      <CheckCircle
                        weight="fill"
                        className="text-green-700"
                        size={23}
                      />
                      <div> You are on this plan</div>
                    </p>
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
                    Elevate your experience with Premium for only 29,000 VND.
                    Unlock unlimited high-quality streaming and full library
                    access while directly supporting the platform&apos;s growth.
                    Go beyond the basics—no ads, just pure music.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative flex w-full flex-col items-center gap-4 rounded-3xl border border-amber-500/40 bg-zinc-100 p-4 pt-6 shadow-sm dark:bg-zinc-950">
              <div className="absolute -top-4 rounded-xl bg-gradient-to-r from-[#b38728] via-[#fcf6ba] to-[#aa771c] px-6 py-1 text-center text-sm font-semibold text-white shadow-[0_2px_8px_rgba(212,175,55,0.3)] dark:bg-rose-600">
                Upgrade
              </div>

              <h1 className="flex items-center text-center">
                {theme === "dark" ? (
                  <img
                    src="/img/logo/Logotype Premium (Dark).svg"
                    alt="Polar"
                    className="w-28"
                  />
                ) : (
                  <img
                    src="/img/logo/Logotype Premium (Light).svg"
                    alt="Polar"
                    className="w-28"
                  />
                )}

                <div className="mt-4 font-mono text-sm font-semibold text-amber-400 dark:text-amber-500">
                  Creator
                </div>
              </h1>

              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="flex items-end gap-1 text-center text-3xl font-semibold tabular-nums text-amber-400 dark:text-amber-500">
                  {PRICE_MONTHLY_PRO_VND} VND
                </div>

                <p className="space-y-4 text-sm">
                  <p className="flex items-center gap-1 font-medium">
                    <NotSupersetOf
                      weight="fill"
                      className="text-amber-400 dark:text-amber-500"
                      size={23}
                    />
                    <div>No ad interruptions.</div>
                  </p>

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
                    <CreditCard
                      weight="fill"
                      className="text-amber-400 dark:text-amber-500"
                      size={23}
                    />
                    <div>Support platform development fee.</div>
                  </p>

                  <p className="flex items-center gap-1 font-medium">
                    <UsersThree
                      weight="fill"
                      className="text-amber-400 dark:text-amber-500"
                      size={23}
                    />
                    <div>Start creating a music channel.</div>
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
                    Upgrade to Premium Creator for just 49,000 VND. Enjoy
                    ad-free, high-quality streaming and full library access.
                    Support the platform while you create your own music
                    channel—no interruptions, just pure sound.
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
