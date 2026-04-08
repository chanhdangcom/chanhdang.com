/* eslint-disable @next/next/no-img-element */
"use client";

import { useParams, useSearchParams } from "next/navigation";

import { useEffect, useState } from "react";
import { MotionHeaderMusic } from "./component/motion-header-music";
import { MenuBar } from "./menu-bar";
import { MenuBarMobile } from "./menu-bar-mobile";
import { BackButton } from "./component/back-button";

import {
  QrCode,
  HighDefinition,
  BookmarksSimple,
  CreditCard,
  NotSupersetOf,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import { ChanhdangLogotypeMusic } from "@/components/chanhdang-logotype-music";
import { getMusicPlanConfig, resolveMusicPlan } from "@/lib/music-plans";

/** Hiển thị mã QR từ URL thanh toán (dùng API ảnh, không cần package qrcode.react). */
function PaymentQRImage({
  value,
  size = 220,
}: {
  value: string;
  size?: number;
}) {
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;
  return (
    <img
      src={qrSrc}
      alt="Mã QR thanh toán"
      width={size}
      height={size}
      className="rounded-lg"
    />
  );
}

type QrPayload = {
  gateway: "vnpay";
  paymentUrl: string;
  orderId: string;
  amount: number;
  plan: "premium" | "creator";
};

export function CheckoutPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = (params?.locale as string) || "vi";
  const plan = resolveMusicPlan(searchParams.get("plan"));
  const planConfig = getMusicPlanConfig(plan);
  const isCreatorPlan = plan === "creator";

  const [qrPayload, setQrPayload] = useState<QrPayload | null>(null);
  const [qrLoading, setQrLoading] = useState<"vnpay" | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);

  const createVnpayQr = async () => {
    setQrError(null);
    setQrLoading("vnpay");
    try {
      const res = await fetch("/api/music/payment/vnpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, plan }),
      });
      const data = await res.json();
      if (!res.ok) {
        setQrError(data.error ?? "Không tạo được mã VNPay");
        return;
      }
      setQrPayload({
        gateway: "vnpay",
        paymentUrl: data.paymentUrl,
        orderId: data.orderId,
        amount: data.amount ?? planConfig.amount,
        plan: data.plan ?? plan,
      });
    } catch {
      setQrError("Lỗi kết nối. Thử lại sau.");
    } finally {
      setQrLoading(null);
    }
  };

  const clearQr = () => {
    setQrPayload(null);
    setQrError(null);
  };

  useEffect(() => {
    clearQr();
  }, [plan]);

  return (
    <div className="flex font-apple">
      <MotionHeaderMusic />

      <MenuBar />

      <div className="mx-4 mt-8 w-full md:ml-[270px] md:mt-0">
        <div className="relative z-10">
          <BackButton />

          <div className="space-y-6">
            {/* Thông tin gói & giá */}
            <div className="mt-8 rounded-3xl border p-4 shadow-sm dark:border-zinc-800">
              <div className="flex items-center justify-center">
                <ChanhdangLogotypeMusic height={28} className="w-auto" />
              </div>

              <div
                className={`mt-2 rounded-2xl border bg-zinc-100 p-4 dark:bg-zinc-950 ${
                  isCreatorPlan
                    ? "border-amber-500/40"
                    : "border-rose-500/40"
                }`}
              >
                <div className="items-center justify-between space-y-4 md:flex md:space-y-0">
                  <p className="space-y-2 text-sm">
                    <p className="flex items-center gap-1 font-medium">
                      <NotSupersetOf
                        weight="fill"
                        className={
                          isCreatorPlan
                            ? "text-amber-400 dark:text-amber-500"
                            : "text-rose-500 dark:text-rose-600"
                        }
                        size={23}
                      />
                      <div>No ad interruptions.</div>
                    </p>

                    <p className="flex items-center gap-1 font-medium">
                      <HighDefinition
                        weight="fill"
                        className={
                          isCreatorPlan
                            ? "text-amber-400 dark:text-amber-500"
                            : "text-rose-500 dark:text-rose-600"
                        }
                        size={23}
                      />
                      <div>Unlimited listening, high quality.</div>
                    </p>

                    <p className="flex items-center gap-1 font-medium">
                      <BookmarksSimple
                        weight="fill"
                        className={
                          isCreatorPlan
                            ? "text-amber-400 dark:text-amber-500"
                            : "text-rose-500 dark:text-rose-600"
                        }
                        size={23}
                      />
                      <div>Use library.</div>
                    </p>

                    <p className="flex items-center gap-1 font-medium">
                      <CreditCard
                        weight="fill"
                        className={
                          isCreatorPlan
                            ? "text-amber-400 dark:text-amber-500"
                            : "text-rose-500 dark:text-rose-600"
                        }
                        size={23}
                      />
                      <div>Support platform development fee.</div>
                    </p>

                    {isCreatorPlan && (
                      <p className="flex items-center gap-1 font-medium">
                        <UsersThree
                          weight="fill"
                          className="text-amber-400 dark:text-amber-500"
                          size={23}
                        />
                        <div>Start creating a music channel.</div>
                      </p>
                    )}
                  </p>

                  <p
                    className={`flex items-center justify-center gap-1 text-2xl font-semibold tabular-nums md:text-right ${
                      isCreatorPlan
                        ? "text-amber-400 dark:text-amber-500"
                        : "text-rose-500 dark:text-rose-600"
                    }`}
                  >
                    {planConfig.amountLabel} VND
                  </p>
                </div>
              </div>
            </div>

            {/* Thanh toán bằng QR - VNPay */}
            <div className="space-y-2 rounded-3xl border p-4 shadow-sm dark:border-zinc-800">
              <h2 className="font-bold">Pay with QR - VNPay</h2>

              <p className="flex items-center gap-1 text-sm font-medium">
                <QrCode weight="fill" className="text-rose-500" size={23} />

                <div>Create a QR code, open the VNPay app to scan and pay.</div>
              </p>

              {!qrPayload ? (
                <>
                  <div className="mt-2 flex gap-4">
                    <div
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-500/40 bg-zinc-100 p-2 text-blue-600 hover:bg-blue-50 dark:bg-zinc-950 dark:text-blue-400 dark:hover:bg-blue-950/50"
                      onClick={createVnpayQr}
                    >
                      <img
                        src="/img/VNPay-icon.jpg"
                        alt="VNPay"
                        className="size-6 rounded-lg border"
                      />

                      <span className="font-semibold">
                        {qrLoading === "vnpay" ? "Đang tạo..." : "VNPay"}
                      </span>
                    </div>
                  </div>

                  {qrError && (
                    <p className="mt-3 text-sm text-amber-600 dark:text-amber-400">
                      {qrError}
                    </p>
                  )}
                </>
              ) : (
                <div className="relative overflow-hidden rounded-2xl border border-rose-500/40 p-4">
                  <div className="justify-between md:flex">
                    <div className="text-xs font-semibold">
                      {qrPayload.gateway.toUpperCase()} - {qrPayload.orderId}
                    </div>

                    <div className="text-sm text-zinc-500" onClick={clearQr}>
                      Tạo mã khác
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col items-center gap-3">
                    <div className="rounded-2xl border bg-zinc-100 p-2 shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
                      <PaymentQRImage value={qrPayload.paymentUrl} size={220} />
                    </div>

                    <p className="flex items-center gap-1.5 text-lg font-semibold text-black dark:text-white">
                      {qrPayload.plan === "creator"
                        ? "Premium Creator - "
                        : "Premium - "}
                      {qrPayload.amount.toLocaleString("vi-VN")} đ
                    </p>

                    <a
                      href={qrPayload.paymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full md:max-w-md"
                    >
                      <div className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 p-2 text-white hover:opacity-90 dark:bg-rose-600">
                        <img
                          src="/img/VNPay-icon.jpg"
                          alt="VNPay"
                          className="size-6 rounded-md"
                        />
                        Open VNPay
                      </div>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="my-40">
          <MenuBarMobile />
        </div>
      </div>
    </div>
  );
}
