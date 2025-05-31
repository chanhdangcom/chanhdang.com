/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { Lens } from "@/components/ui/lens";
import { motion } from "motion/react";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import { Confetti } from "../profile/components/confetti";
import { Footer } from "../profile/footer";
import { Introduce } from "./introduce";

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
    <div>
      <Confetti />

      <div className="flex">
        <a href="/helper#Login" className="text-blue-500 underline">
          Đăng nhập
        </a>

        <a href="/helper#QLThucUong" className="text-blue-500 underline">
          Quản lí thức uống
        </a>

        <a href="/helper#LQBanHang" className="text-blue-500 underline">
          Quản lí bán hàng
        </a>

        <a href="/helper#QLBan" className="text-blue-500 underline">
          Quản lí bàn
        </a>
      </div>

      <Introduce />
      <TracingBeam className="px-6">
        <div className="mx-auto mt-16 max-w-lg text-2xl tracking-tight md:text-5xl">
          <div className="text-4xl">Hướng dẫn sử dụng phần mềm</div>
          <PointerHighlight>
            <span className="font-bold text-blue-500">Quản lí quản cà phê</span>
          </PointerHighlight>
        </div>

        <div className="relative mx-auto max-w-6xl pt-4 antialiased">
          {dummyContent.map((item, index) => (
            <div key={`content-${index}`} id={item.badge} className="mb-10">
              <>
                {item?.image && (
                  <div className="relative mx-auto my-10 max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-r from-[#1D2235] to-[#121318] p-8">
                    <div className="relative z-10">
                      <Lens hovering={hovering} setHovering={setHovering}>
                        <img
                          src={item.image}
                          alt="blog thumbnail"
                          height="5000"
                          width="5000"
                          className="mb-10 h-auto max-w-full rounded-lg object-cover"
                        />
                      </Lens>

                      <motion.div
                        animate={{
                          filter: hovering ? "blur(2px)" : "blur(0px)",
                        }}
                        className="relative z-20 py-4"
                      >
                        <h2 className="text-left text-2xl font-bold text-white">
                          {item.title}
                        </h2>

                        <p className="mt-4 text-left text-neutral-200">
                          {item.description}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                )}
              </>
            </div>
          ))}
        </div>
        <div className="mb-16">
          <Footer />
        </div>
      </TracingBeam>
    </div>
  );
}

const dummyContent = [
  {
    title: "Đăng nhập",
    description: (
      <>
        <p>
          Cho phép người dùng (Quản trị viên hoặc Nhân viên) truy cập vào hệ
          thống bằng cách cung cấp tên đăng nhập và mật khẩu hợp lệ. Hệ thống sẽ
          xác thực thông tin và chuyển hướng người dùng đến giao diện chính phù
          hợp với quyền hạn của họ.
        </p>
      </>
    ),
    badge: "Login",
    image: "/img/helper/DangNhap.jpg",
  },
  {
    title: "Quản lí từng bàn",
    description: (
      <>
        <p>
          Cho phép nhân viên hoặc quản trị viên chọn một bàn cụ thể từ danh sách
          các bàn có sẵn để bắt đầu hoặc tiếp tục một order. Trạng thái của bàn
          (phục vụ, trống, đang phục vụ) được hiển thị trực quan.
        </p>
      </>
    ),
    badge: "QLBanHang",
    image: "/img/helper/QLBanHang.jpg",
  },
  {
    title: "Quản lí bàn",
    description: (
      <>
        <p>
          Cho phép nhân viên hoặc quản trị viên chọn một bàn cụ thể từ danh sách
          các bàn có sẵn để bắt đầu hoặc tiếp tục một order. Trạng thái của bàn
          (phục vụ, trống, đang phục vụ) được hiển thị trực quan.
        </p>
      </>
    ),
    badge: "QLBan",
    image: "/img/helper/QLBan.jpg",
  },

  {
    title: "Quản thức uống",
    description: (
      <>
        <p>
          Cho phép nhân viên hoặc quản trị viên chọn một bàn cụ thể từ danh sách
          các bàn có sẵn để bắt đầu hoặc tiếp tục một order. Trạng thái của bàn
          (phục vụ, trống, đang phục vụ) được hiển thị trực quan.
        </p>
      </>
    ),
    badge: "QLThucUong",
    image: "/img/helper/QLThucUong.jpg",
  },
];
