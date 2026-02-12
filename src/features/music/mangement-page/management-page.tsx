"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { usePermissions } from "@/hooks/use-permissions";
import {
  MicrophoneStage,
  MusicNotesSimple,
  ShieldCheck,
  UsersThree,
  Queue,
} from "@phosphor-icons/react/dist/ssr";

export function ManagementPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "vi";
  const { canAddMusic, canAddSinger, canManageSystem } = usePermissions();

  const managementLinks = [
    {
      title: "Quản lý users",
      description: "Phân quyền và cập nhật role người dùng",
      href: `/${locale}/music/admin`,
      isAllowed: canManageSystem,
      icon: UsersThree,
    },
    {
      title: "Thêm nhạc",
      description: "Tạo bài hát mới vào hệ thống",
      href: `/${locale}/music/add-music`,
      isAllowed: canAddMusic,
      icon: MusicNotesSimple,
    },
    {
      title: "Thêm topic",
      description: "Tạo topic mới và gán danh sách bài hát",
      href: `/${locale}/music/add-topic`,
      isAllowed: canManageSystem,
      icon: Queue,
    },
    {
      title: "Thêm playlist",
      description: "Tạo playlist mới cho thư viện nhạc",
      href: `/${locale}/music/add-playlist`,
      isAllowed: canManageSystem,
      icon: Queue,
    },
    {
      title: "Thêm ca sĩ",
      description: "Quản lý hồ sơ ca sĩ và thông tin nghệ sĩ",
      href: `/${locale}/music/add-singer`,
      isAllowed: canAddSinger,
      icon: MicrophoneStage,
    },
  ];

  return (
    <div className="px-4 py-8 font-apple md:ml-[280px] md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 rounded-3xl border border-zinc-300 bg-zinc-100/60 p-6 backdrop-blur-2xl dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="mb-2 flex items-center gap-2">
            <ShieldCheck size={24} className="text-blue-500" />
            <h1 className="text-2xl font-bold text-black dark:text-white">
              Trang quản lý nhạc
            </h1>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Tổng hợp các trang quản lý: users, thêm nhạc, thêm topic, thêm
            playlist và thêm ca sĩ.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {managementLinks.map((item) => {
            const Icon = item.icon;
            const cardClassName =
              "rounded-2xl border p-4 transition-all duration-200";

            if (!item.isAllowed) {
              return (
                <div
                  key={item.href}
                  className={`${cardClassName} cursor-not-allowed border-zinc-300 bg-zinc-200/60 opacity-60 dark:border-zinc-800 dark:bg-zinc-900/70`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Icon size={20} className="text-zinc-500" />
                    <h2 className="font-semibold text-black dark:text-white">
                      {item.title}
                    </h2>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {item.description}
                  </p>
                  <div className="mt-3 text-xs font-medium text-rose-600 dark:text-rose-400">
                    Bạn chưa có quyền truy cập mục này
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${cardClassName} border-zinc-300 bg-zinc-100/70 hover:-translate-y-0.5 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/70 dark:hover:bg-zinc-900`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <Icon size={20} className="text-blue-500" />
                  <h2 className="font-semibold text-black dark:text-white">
                    {item.title}
                  </h2>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {item.description}
                </p>
                <div className="mt-3 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Mở trang quản lý
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
