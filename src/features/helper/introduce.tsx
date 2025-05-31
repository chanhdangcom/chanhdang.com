"use client";
import { HeroParallax } from "@/components/ui/hero-parallax";
import React from "react";

export function Introduce() {
  return <HeroParallax products={products} />;
}
export const products = [
  {
    title: "Đăng nhập",
    link: "https://gomoonbeam.com",
    thumbnail: "/img/helper/DangNhap.jpg",
  },
  {
    title: "Quản lý bàn",
    link: "https://cursor.so",
    thumbnail: "/img/helper/QLBan.jpg",
  },
  {
    title: "Quản lý thức uống",
    link: "https://userogue.com",
    thumbnail: "/img/helper/QLThucUong.jpg",
  },

  {
    title: "Quản lý danh mục",
    link: "https://editorially.org",
    thumbnail: "/img/helper/QLDanhMuc.jpg",
  },
  {
    title: "Quản lý kho",
    link: "https://editrix.ai",
    thumbnail: "/img/helper/QLKho.jpg",
  },
  {
    title: "Quản lý nguyên liệu",
    link: "https://app.pixelperfect.quest",
    thumbnail: "/img/helper/QLNguyenLieu.jpg",
  },

  {
    title: "Quản lí tài khoản",
    link: "https://algochurn.com",
    thumbnail: "/img/helper/QLTaiKhoan.jpg",
  },
  {
    title: "Thống kê doanh thu",
    link: "https://ui.aceternity.com",
    thumbnail: "/img/helper/ThongKeDoanhThu.jpg",
  },
  {
    title: "Thống kê thức uống",
    link: "https://tailwindmasterkit.com",
    thumbnail: "/img/helper/ThongKeThucUong.jpg",
  },
  {
    title: "Đổi mật khẩu",
    link: "https://smartbridgetech.com",
    thumbnail: "/img/helper/DoiMK.jpg",
  },
  {
    title: "Hoá đơn",
    link: "https://renderwork.studio",
    thumbnail: "/img/helper/HoaDon.jpg",
  },

  {
    title: "Quản lý từng bàn",
    link: "https://cremedigital.com",
    thumbnail: "/img/helper/QLBanHang.jpg",
  },

  {
    title: "Thanh Toán",
    link: "https://invoker.lol",
    thumbnail: "/img/helper/ThanhToan.jpg",
  },

  {
    title: "Demo",
    link: "https://cremedigital.com1",
    thumbnail: "/img/helper/QLBanHang.jpg",
  },

  {
    title: "Demo",
    link: "https://invoker.lol1",
    thumbnail: "/img/helper/ThanhToan.jpg",
  },
];
