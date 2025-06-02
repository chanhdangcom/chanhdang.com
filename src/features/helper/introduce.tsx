import React from "react";
import { Timeline } from "@/components/ui/timeline";

export function Introduce() {
  const data = [
    {
      title: "Đăng nhập",
      content: (
        <div id="Login">
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Cho phép người dùng (Quản trị viên hoặc Nhân viên) truy cập vào hệ
            thống bằng cách cung cấp tên đăng nhập và mật khẩu hợp lệ. Hệ thống sẽ
            xác thực thông tin và chuyển hướng người dùng đến giao diện chính phù
            hợp với quyền hạn của họ.
          </p>
          <div className="">
            <img
              src="/img/helper/DangNhap.jpg"
              alt="startup template"
              width={500}
              height={500}
              className="h-auto w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] "
            />

          </div>
        </div>
      ),
    },
    {
      title: "Quản lý bán hàng",
      content: (
        <div id="QLBanHang">
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            I usually run out of copy, but when I see content this big, I try to
            integrate lorem ipsum.
          </p>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Lorem ipsum is for people who are too lazy to write copy. But we are
            not. Here are some more example of beautiful designs I built.
          </p>
          <div className="">
            <img
              src="/img/helper/QLBanHang.jpg"
              alt="hero template"
              width={500}
              height={500}
              className="h-auto w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="relative w-full overflow-clip bg-black">
      <Timeline data={data} />
    </div>
  );
}
