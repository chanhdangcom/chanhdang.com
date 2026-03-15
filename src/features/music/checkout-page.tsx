/* eslint-disable @next/next/no-img-element */
"use client";

import { useParams } from "next/navigation";

import { useState } from "react";
import { MotionHeaderMusic } from "./component/motion-header-music";
import { MenuBar } from "./menu-bar";
import { MenuBarMobile } from "./menu-bar-mobile";
import { BackButton } from "./component/back-button";

import {
  QrCode,
  HighDefinition,
  BookmarksSimple,
  UsersThree,
  CreditCard,
} from "@phosphor-icons/react/dist/ssr";
import { ChanhdangLogotypeMusic } from "@/components/chanhdang-logotype-music";

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

const PRICE_MONTHLY_VND = "29.000";
const PRICE_NUM = 29_000;

type QrPayload = {
  gateway: "vnpay" | "momo";
  paymentUrl: string;
  orderId: string;
  amount: number;
};

export function CheckoutPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "vi";

  const [qrPayload, setQrPayload] = useState<QrPayload | null>(null);
  const [qrLoading, setQrLoading] = useState<"vnpay" | "momo" | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);

  const createVnpayQr = async () => {
    setQrError(null);
    setQrLoading("vnpay");
    try {
      const res = await fetch("/api/music/payment/vnpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale }),
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
        amount: data.amount ?? PRICE_NUM,
      });
    } catch {
      setQrError("Lỗi kết nối. Thử lại sau.");
    } finally {
      setQrLoading(null);
    }
  };

  const createMomoQr = async () => {
    setQrError(null);
    setQrLoading("momo");
    try {
      const res = await fetch("/api/music/payment/momo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale }),
      });
      const data = await res.json();
      if (!res.ok) {
        setQrError(data.error ?? "Không tạo được mã Momo");
        return;
      }
      setQrPayload({
        gateway: "momo",
        paymentUrl: data.payUrl,
        orderId: data.orderId,
        amount: data.amount ?? PRICE_NUM,
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

              <h1 className="font-bold">Choose a plan</h1>

              <div className="mt-2 rounded-2xl border border-rose-500/40 bg-zinc-100 p-4 dark:bg-zinc-950">
                <div className="items-center justify-between space-y-4 md:flex md:space-y-0">
                  <p className="space-y-2 text-sm">
                    <p className="flex items-center gap-1 font-medium">
                      <HighDefinition
                        weight="fill"
                        className="text-rose-500"
                        size={23}
                      />
                      <div>Unlimited listening, high quality.</div>
                    </p>

                    <p className="flex items-center gap-1 font-medium">
                      <BookmarksSimple
                        weight="fill"
                        className="text-rose-500"
                        size={23}
                      />
                      <div>Use library.</div>
                    </p>

                    <p className="flex items-center gap-1 font-medium">
                      <UsersThree
                        weight="fill"
                        className="text-rose-500"
                        size={23}
                      />
                      <div>Start creating a music channel.</div>
                    </p>

                    <p className="flex items-center gap-1 font-medium">
                      <CreditCard
                        weight="fill"
                        className="text-rose-500"
                        size={23}
                      />
                      <div>Support platform development fee.</div>
                    </p>
                  </p>

                  <p className="flex items-center justify-center gap-1 text-2xl font-semibold tabular-nums text-rose-500 dark:text-rose-600 md:text-right">
                    {PRICE_MONTHLY_VND}

                    <div className="flex items-center">
                      <span className="ml-0.5 font-normal text-zinc-500">
                        đ
                      </span>

                      <span className="block font-normal text-zinc-500">
                        /month
                      </span>
                    </div>
                  </p>
                </div>
              </div>
            </div>

            {/* Thanh toán bằng QR – VNPay / Momo */}
            <div className="space-y-2 rounded-3xl border p-4 shadow-sm dark:border-zinc-800">
              <h2 className="font-bold">Pay with QR – VNPay / Momo</h2>

              <p className="flex items-center gap-1 text-sm font-medium">
                <QrCode weight="fill" className="text-rose-500" size={23} />

                <div>
                  Create a QR code, open the VNPay or Momo app to scan and pay.
                </div>
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
                        className="size-10 rounded-lg border"
                      />

                      <span className="font-semibold">
                        {qrLoading === "vnpay" ? "Đang tạo..." : "VNPay"}
                      </span>
                    </div>

                    <div
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-500/40 bg-zinc-100 text-rose-500 hover:bg-pink-50 dark:bg-zinc-950 dark:hover:bg-pink-950/50"
                      onClick={createMomoQr}
                    >
                      <img
                        src="/img/momo-icon.png"
                        alt="Momo"
                        className="size-10 rounded-lg"
                      />

                      <span className="font-semibold">
                        {qrLoading === "momo" ? "Đang tạo..." : "Momo"}
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
                <div className="rounded-2xl border border-rose-500/40 bg-zinc-100 p-4 dark:bg-zinc-950">
                  <div className="flex justify-between">
                    <div className="text-xs font-semibold">
                      {qrPayload.gateway.toUpperCase()} – {qrPayload.orderId}
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
                          src={
                            qrPayload.gateway === "vnpay"
                              ? "/img/VNPay-icon.jpg"
                              : "/img/momo-icon.png"
                          }
                          alt={qrPayload.gateway === "vnpay" ? "VNPay" : "Momo"}
                          className="size-6 rounded-md"
                        />
                        Open {qrPayload.gateway === "vnpay" ? "VNPay" : "Momo"}
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
