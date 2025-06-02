"use client";
import React, { useEffect } from "react";

import { Confetti } from "../profile/components/confetti";
import { Introduce } from "./introduce";
import { WavyBackground } from "@/components/ui/wavy-background";
import { TextGenerateEffect } from "@/components/text-generate-effect";
import { FlipWords } from "@/components/flip-words";
import { Footer } from "./footer";

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
    <div className="bg-black font-mono">
      <Confetti />
      <WavyBackground className="max-w-full mx-auto ">
        <div className="max-w-4xl mx-auto ">
          <p className="text-2xl md:text-4xl lg:text-4xl text-white font-bold inter-var text-center">
            Quản Lý Quán

            <FlipWords className="text-2xl md:text-4xl lg:text-6xl  font-bold inter-var text-center ml-4" words={words} />
          </p>

          <TextGenerateEffect className="text-lg font-normal inter-var text-center" words={string} />
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex gap-4 bg-white w-fit bg-gradient-to-l from-gray-500 rounded-2xl w-full">
            <a href="/helper#Login" className="text-black p-2 px-6 font-semibold hover:bg-zinc-300 cursor-pointer rounded-xl p-1">Đăng nhập</a>
            <a href="/helper#QLBanHang" className="text-black p-2 px-6 font-semibold hover:bg-zinc-300 cursor-pointer rounded-xl p-1">Quản lý bán hàng</a>
            <a href="/helper#QLDanhMuc" className="text-black p-2 px-6 font-semibold hover:bg-zinc-300 cursor-pointer rounded-xl p-1">Quản lý danh mục</a>
            <a href="/helper#QLThucUong" className="text-black p-2 px-6 font-semibold hover:bg-zinc-300 cursor-pointer rounded-xl p-1">Quản lý thức uống</a>
            <a href="/helper#QLKho" className="text-black p-2 px-6 font-semibold hover:bg-zinc-300 cursor-pointer rounded-xl p-1">Quản lý kho</a>
            <a href="/helper#QLBan" className="text-black p-2 px-6 font-semibold hover:bg-zinc-300 cursor-pointer rounded-xl p-1">Quản lý bàn</a>
            <a href="/helper#QLNguyenLieu" className="text-black p-2 px-6 font-semibold hover:bg-zinc-300 cursor-pointer rounded-xl p-1">Quản lý nguyên liệu</a>
            <a href="/helper#ThanhToan" className="text-black p-2 px-6 font-semibold hover:bg-zinc-300 cursor-pointer rounded-xl p-1">Thanh toán</a>
          </div>

          <div className="flex gap-4 bg-white w-fit bg-gradient-to-l from-gray-500 rounded-2xl w-full">
            <a href="/helper#QLTK" className="text-black p-2 px-6 font-semibold hover:bg-zinc-300 cursor-pointer rounded-xl p-1">Quản lý tài khoản</a>
            <a href="/helper#DoiMK" className="text-black p-2 px-6 font-semibold hover:bg-zinc-300 cursor-pointer rounded-xl p-1">Đổi mật khẩu</a>
            <a href="/helper#TKDoanhThu" className="text-black p-2 px-6 font-semibold hover:bg-zinc-300 cursor-pointer rounded-xl p-1">Thông kê doanh thu</a>
            <a href="/helper#TKThucUong" className="text-black p-2 px-6 font-semibold hover:bg-zinc-300 cursor-pointer rounded-xl p-1">Thống kê thức uống</a>
            <a href="/helper#HoaDon" className="text-black p-2 px-6 font-semibold hover:bg-zinc-300 cursor-pointer rounded-xl p-1">Hoá đơn</a>
            <a href="/helper#HHHoaDon" className="text-black p-2 px-6 font-semibold hover:bg-zinc-300 cursor-pointer rounded-xl p-1">Danh sách hóa đơn</a>
          </div>
        </div>


      </WavyBackground>

      <Introduce />

      <div className="mt-16"><Footer /></div>
    </div >
  );


}