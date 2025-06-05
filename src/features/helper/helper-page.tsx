"use client";
import React, { useEffect } from "react";

import { Confetti } from "../profile/components/confetti";
import { Introduce } from "./introduce";
import { WavyBackground } from "@/components/ui/wavy-background";
import { Footer } from "./footer";
import { FlipWords } from "@/components/flip-words";
import { TextGenerateEffect } from "@/components/text-generate-effect";

export function HelperPage() {
  const string = `Ứng dụng được phát triển bằng công nghệ C# .NET Windows Forms kết hợp
            SQL Server, Entity, hỗ trợ quản lý bán hàng, bàn, thức uống và hóa đơn một cách
            hiệu quả. Dự án là kết quả của sự hợp tác chặt chẽ trong nhóm 2 người,
            trải qua nhiều giai đoạn thiết kế, lập trình và kiểm thử để đảm bảo tính
            ổn định và dễ sử dụng.`;

  const words = ["Cà Phê", "Coffee", "Café", "Espresso"];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash) {
        const el = document.getElementById(hash.substring(1));
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: "smooth" });
          }, 300);
        }
      }
    }
  }, []);

  return (
    <div className="">
      <Confetti />
      <WavyBackground className="mx-auto max-w-full">
        <div className="mx-auto max-w-4xl">
          <p className="inter-var text-center text-2xl font-bold text-white md:text-4xl lg:text-4xl">
            Quản Lý Quán
            <FlipWords
              className="inter-var ml-4 text-center text-2xl font-bold md:text-4xl lg:text-6xl"
              words={words}
            />
          </p>

          <TextGenerateEffect
            className="inter-var text-center text-lg font-normal"
            words={string}
          />
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex w-full gap-4 rounded-2xl bg-white bg-gradient-to-l from-gray-500">
            <a
              href="/helper#Login"
              className="cursor-pointer rounded-xl p-2 px-6 font-semibold text-black hover:bg-zinc-300"
            >
              Đăng nhập
            </a>
            <a
              href="/helper#QLBanHang"
              className="cursor-pointer rounded-xl p-2 px-6 font-semibold text-black hover:bg-zinc-300"
            >
              Quản lý bán hàng
            </a>
            <a
              href="/helper#QLDanhMuc"
              className="cursor-pointer rounded-xl p-2 px-6 font-semibold text-black hover:bg-zinc-300"
            >
              Quản lý danh mục
            </a>
            <a
              href="/helper#QLThucUong"
              className="cursor-pointer rounded-xl p-2 px-6 font-semibold text-black hover:bg-zinc-300"
            >
              Quản lý thức uống
            </a>
            <a
              href="/helper#QLKho"
              className="cursor-pointer rounded-xl p-2 px-6 font-semibold text-black hover:bg-zinc-300"
            >
              Quản lý kho
            </a>
            <a
              href="/helper#QLBan"
              className="cursor-pointer rounded-xl p-2 px-6 font-semibold text-black hover:bg-zinc-300"
            >
              Quản lý bàn
            </a>
            <a
              href="/helper#QLNguyenLieu"
              className="cursor-pointer rounded-xl p-2 px-6 font-semibold text-black hover:bg-zinc-300"
            >
              Quản lý nguyên liệu
            </a>
            <a
              href="/helper#ThanhToan"
              className="cursor-pointer rounded-xl p-2 px-6 font-semibold text-black hover:bg-zinc-300"
            >
              Thanh toán
            </a>
          </div>

          <div className="flex w-full gap-4 rounded-2xl bg-white bg-gradient-to-l from-gray-500">
            <a
              href="/helper#Login"
              className="cursor-pointer rounded-xl p-2 px-6 font-semibold text-black hover:bg-zinc-300"
            >
              Quản lý tài khoản
            </a>
            <a
              href="/helper#Login"
              className="cursor-pointer rounded-xl p-2 px-6 font-semibold text-black hover:bg-zinc-300"
            >
              Đổi mật khẩu
            </a>
            <a
              href="/helper#Login"
              className="cursor-pointer rounded-xl p-2 px-6 font-semibold text-black hover:bg-zinc-300"
            >
              Thanh toán
            </a>
            <a
              href="/helper#Login"
              className="cursor-pointer rounded-xl p-2 px-6 font-semibold text-black hover:bg-zinc-300"
            >
              Thông kê doanh thu
            </a>
            <a
              href="/helper#Login"
              className="cursor-pointer rounded-xl p-2 px-6 font-semibold text-black hover:bg-zinc-300"
            >
              Thống kê thức uống
            </a>
            <a
              href="/helper#Login"
              className="cursor-pointer rounded-xl p-2 px-6 font-semibold text-black hover:bg-zinc-300"
            >
              Hoá đơn
            </a>
          </div>
        </div>
      </WavyBackground>

      <Introduce />

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}
