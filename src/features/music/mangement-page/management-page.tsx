"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePermissions } from "@/hooks/use-permissions";
import {
  MicrophoneStage,
  MusicNotesSimple,
  UsersThree,
  Queue,
} from "@phosphor-icons/react/dist/ssr";
import { MenuBar } from "../menu-bar";
import { HeaderMusicPage } from "../header-music-page";

export function ManagementPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "vi";
  const { canAddMusic, canAddSinger, canManageSystem } = usePermissions();
  const t = useTranslations("music.management");

  const managementLinks = [
    {
      title: t("manageUsers"),
      description: t("manageUsersDesc"),
      href: `/${locale}/music/admin`,
      isAllowed: canManageSystem,
      icon: UsersThree,
    },
    {
      title: t("addMusic"),
      description: t("addMusicDesc"),
      href: `/${locale}/music/add-music`,
      isAllowed: canAddMusic,
      icon: MusicNotesSimple,
    },
    {
      title: t("addTopic"),
      description: t("addTopicDesc"),
      href: `/${locale}/music/add-topic`,
      isAllowed: canManageSystem,
      icon: Queue,
    },
    {
      title: t("addPlaylist"),
      description: t("addPlaylistDesc"),
      href: `/${locale}/music/add-playlist`,
      isAllowed: canManageSystem,
      icon: Queue,
    },
    {
      title: t("addSinger"),
      description: t("addSingerDesc"),
      href: `/${locale}/music/add-singer`,
      isAllowed: canAddSinger,
      icon: MicrophoneStage,
    },
  ];

  return (
    <div className="mx-4 py-4 font-apple md:ml-[270px]">
      <MenuBar />

      <div className="mx-auto w-full">
        <div className="">
          <HeaderMusicPage name={t("hub")} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {managementLinks.map((item) => {
            const Icon = item.icon;
            const cardClassName =
              "rounded-2xl border dark:border-zinc-800 shadow-sm p-4 transition-all duration-200";

            if (!item.isAllowed) {
              return (
                <div
                  key={item.href}
                  className={`${cardClassName} cursor-not-allowed`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Icon
                      size={20}
                      className="text-rose-500 dark:text-blue-500"
                    />

                    <h2 className="font-semibold text-black dark:text-white">
                      {item.title}
                    </h2>
                  </div>

                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {item.description}
                  </p>

                  <div className="mt-3 text-xs font-medium text-rose-600 dark:text-rose-400">
                    {t("noAccess")}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${cardClassName} `}
              >
                <div className="mb-2 flex items-center gap-2">
                  <Icon
                    size={20}
                    className="text-rose-500 dark:text-blue-500"
                    weight="fill"
                  />

                  <h2 className="font-semibold text-black dark:text-white">
                    {item.title}
                  </h2>
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
