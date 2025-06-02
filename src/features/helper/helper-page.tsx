/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { Lens } from "@/components/ui/lens";
import { motion } from "motion/react";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import { Confetti } from "../profile/components/confetti";
import { Introduce } from "./introduce";
import { WavyBackground } from "@/components/ui/wavy-background";
import { PinContainer } from "@/components/ui/3d-pin";

export function HelperPage() {
  const [hovering, setHovering] = useState(false);

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

      <WavyBackground className="max-w-full mx-auto ">

        <div className="max-w-4xl mx-auto">
          <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
            Quản Lý Quán Cà Phê
          </p>

          <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
            Ứng dụng được phát triển bằng công nghệ C# .NET Windows Forms kết hợp
            SQL Server, Entity, hỗ trợ quản lý bán hàng, bàn, thức uống và hóa đơn một cách
            hiệu quả. Dự án là kết quả của sự hợp tác chặt chẽ trong nhóm 2 người,
            trải qua nhiều giai đoạn thiết kế, lập trình và kiểm thử để đảm bảo tính
            ổn định và dễ sử dụng.
          </p></div>

        <div className="mt-8 space-y-4">
          <div className="flex gap-4 bg-white w-fit bg-gradient-to-l from-gray-500 rounded-2xl  w-full" >
            <a href="/helper#Login" className="text-black p-2 px-6 font-semibold hover:bg-zinc-300 cursor-pointer rounded-xl p-1">Đăng nhập</a>
            <a href="/helper#QLBanHang" className="text-black p-2 px-6 font-semibold hover:bg-zinc-300 cursor-pointer rounded-xl p-1">Quản lý bán hàng</a>
            <a href="/helper#Login" className="text-black p-2 px-6 font-semibold hover:bg-zinc-300 cursor-pointer rounded-xl p-1">Quản lý danh mục</a>
            <a href="/helper#Login" className="text-black p-2 px-6 font-semibold hover:bg-zinc-300 cursor-pointer rounded-xl p-1">Quản lý kho</a>
            <a href="/helper#Login" className="text-black p-2 px-6 font-semibold hover:bg-zinc-300 cursor-pointer rounded-xl p-1">Quản lý bàn</a>
            <a href="/helper#Login" className="text-black p-2 px-6 font-semibold hover:bg-zinc-300 cursor-pointer rounded-xl p-1">Quản lý nguyên liệu</a>
            <a href="/helper#Login" className="text-black p-2 px-6 font-semibold hover:bg-zinc-300 cursor-pointer rounded-xl p-1">Thanh toán</a>
          </div>

          <div className="flex gap-4 bg-white w-fit bg-gradient-to-l from-gray-500 rounded-2xl  w-full">
            <a href="/helper#Login" className="text-black p-2 px-6 font-semibold hover:bg-zinc-300 cursor-pointer rounded-xl p-1">Quản lý tài khoản</a>
            <a href="/helper#Login" className="text-black p-2 px-6 font-semibold hover:bg-zinc-300 cursor-pointer rounded-xl p-1">Đổi mật khẩu</a>
            <a href="/helper#Login" className="text-black p-2 px-6 font-semibold hover:bg-zinc-300 cursor-pointer rounded-xl p-1">Thanh toán</a>
            <a href="/helper#Login" className="text-black p-2 px-6 font-semibold hover:bg-zinc-300 cursor-pointer rounded-xl p-1">Thông kê doanh thu</a>
            <a href="/helper#Login" className="text-black p-2 px-6 font-semibold hover:bg-zinc-300 cursor-pointer rounded-xl p-1">Thống kê thức uống</a>
            <a href="/helper#Login" className="text-black p-2 px-6 font-semibold hover:bg-zinc-300 cursor-pointer rounded-xl p-1">Hoá đơn</a>

          </div>
        </div>

      </WavyBackground>

      <Introduce />
    </div >
  );
}

