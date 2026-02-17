"use client";

import { useTranslations } from "next-intl";
import { useUser } from "@/hooks/use-user";
import { usePermissions } from "@/hooks/use-permissions";
import {
  BookBookmark,
  CardsThree,
  CaretDown,
  CaretRight,
  ChartDonut,
  Clock,
  Crown,
  Gear,
  House,
  MicrophoneStage,
  MusicNotesSimple,
  ShieldCheck,
  SquaresFour,
  UserCircle,
} from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { MagnifyingGlass } from "phosphor-react";
import { LogoutButton } from "./component/logout-button";
import { useEffect, useState } from "react";
import { SwitchLanguageMenuBar } from "@/app/[locale]/features/profile/components/swtich-language-menu-bar";
import { ThemeToggleMenuBar } from "@/components/theme-toggle-menubar";
import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import { cn } from "@/lib/utils";
import { MenuBarItem, type MenuBarItemConfig } from "./component/menu-bar-item";

export function MenuBar() {
  const params = useParams();
  const pathname = usePathname();
  const locale = (params?.locale as string) || "vi";
  const { isAuthenticated } = useUser();
  const { canAddMusic, canAddSinger, canManageSystem, role } = usePermissions();
  const isRegularUser = role === "user";
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const basePath = `/${locale}/music`;
  const tCommon = useTranslations("music.common");
  const tMenu = useTranslations("music.menu");

  const isPathActive = (target: string, exact = false) =>
    exact
      ? pathname === target
      : pathname === target || pathname.startsWith(`${target}/`);

  const getItemClass = (active: boolean) =>
    cn(
      "flex items-center gap-2 rounded-2xl px-4 py-2 transition-colors",
      active ? "bg-zinc-200 dark:bg-zinc-800" : ""
    );

  const getIconClass = (active: boolean) =>
    cn(
      "text-rose-500 dark:text-blue-500",
      active && "text-rose-600 dark:text-blue-400"
    );

  const isManageHubActive = isPathActive(`${basePath}/management-page`);
  const isAdminPanelActive = isPathActive(`${basePath}/admin`);
  const isAddMusicActive = isPathActive(`${basePath}/add-music`);
  const isAddSingerActive = isPathActive(`${basePath}/add-singer`);
  const isManageActive =
    isManageHubActive ||
    isAdminPanelActive ||
    isAddMusicActive ||
    isAddSingerActive;

  useEffect(() => {
    if (isManageActive) {
      setIsDropdownOpen(true);
    }
  }, [isManageActive]);

  const topItems: MenuBarItemConfig[] = [
    {
      key: "search",
      label: tCommon("search"),
      href: `${basePath}/search`,
      isActive: isPathActive(`${basePath}/search`),
      icon: (
        <MagnifyingGlass
          size={25}
          weight={isPathActive(`${basePath}/search`) ? "fill" : "regular"}
          className={getIconClass(isPathActive(`${basePath}/search`))}
        />
      ),
    },
    {
      key: "home",
      label: tCommon("home"),
      href: `${basePath}`,
      isActive: isPathActive(basePath, true),
      icon: (
        <House
          size={25}
          weight={isPathActive(basePath, true) ? "fill" : "regular"}
          className={getIconClass(isPathActive(basePath, true))}
        />
      ),
    },
    {
      key: "new",
      label: tCommon("new"),
      href: `${basePath}/new-release`,
      isActive: isPathActive(`${basePath}/new-release`),
      icon: (
        <SquaresFour
          size={25}
          weight={isPathActive(`${basePath}/new-release`) ? "fill" : "regular"}
          className={getIconClass(isPathActive(`${basePath}/new-release`))}
        />
      ),
    },
  ];

  const libraryItems: MenuBarItemConfig[] = isAuthenticated
    ? [
        {
          key: "recently-played",
          label: tMenu("recentlyPlayed"),
          href: `${basePath}/recently-played`,
          isActive: isPathActive(`${basePath}/recently-played`),
          icon: (
            <Clock
              size={25}
              weight={
                isPathActive(`${basePath}/recently-played`) ? "fill" : "regular"
              }
              className={getIconClass(isPathActive(`${basePath}/recently-played`))}
            />
          ),
        },
        {
          key: "library",
          label: tCommon("library"),
          href: `${basePath}/library`,
          isActive: isPathActive(`${basePath}/library`),
          icon: (
            <CardsThree
              size={25}
              weight={isPathActive(`${basePath}/library`) ? "fill" : "regular"}
              className={getIconClass(isPathActive(`${basePath}/library`))}
            />
          ),
        },
      ]
    : [
        {
          key: "recently-played-disabled",
          label: tMenu("recentlyPlayed"),
          href: `${basePath}/recently-played`,
          disabled: true,
          icon: <Clock size={25} className="text-rose-500 dark:text-blue-500" />,
        },
        {
          key: "library-disabled",
          label: tCommon("library"),
          href: `${basePath}/library`,
          disabled: true,
          icon: (
            <BookBookmark size={25} className="text-rose-500 dark:text-blue-500" />
          ),
        },
      ];

  const manageItems: MenuBarItemConfig[] = [
    {
      key: "manage-hub",
      label: tMenu("managementHub"),
      href: `${basePath}/management-page`,
      isActive: isManageHubActive,
      icon: (
        <ChartDonut
          size={25}
          weight={isManageHubActive ? "fill" : "regular"}
          className={getIconClass(isManageHubActive)}
        />
      ),
    },
    {
      key: "admin-panel",
      label: tMenu("adminPanel"),
      href: `${basePath}/admin`,
      isActive: isAdminPanelActive,
      icon: (
        <ShieldCheck
          size={25}
          weight={isAdminPanelActive ? "fill" : "regular"}
          className={getIconClass(isAdminPanelActive)}
        />
      ),
    },
    {
      key: "add-music",
      label: tMenu("addNewMusic"),
      href: `${basePath}/add-music`,
      isActive: isAddMusicActive,
      disabled: !canAddMusic,
      icon: (
        <MusicNotesSimple
          size={25}
          weight={isAddMusicActive ? "fill" : "regular"}
          className={getIconClass(isAddMusicActive)}
        />
      ),
    },
    {
      key: "add-singer",
      label: tMenu("addArtists"),
      href: `${basePath}/add-singer`,
      isActive: isAddSingerActive,
      disabled: !canAddSinger,
      icon: (
        <MicrophoneStage
          size={25}
          weight={isAddSingerActive ? "fill" : "regular"}
          className={getIconClass(isAddSingerActive)}
        />
      ),
    },
  ];

  const settingsItems: MenuBarItemConfig[] = [
    ...(isAuthenticated
      ? [
          {
            key: "profile",
            label: tMenu("profile"),
            href: `${basePath}/profile-setting`,
            isActive: isPathActive(`${basePath}/profile-setting`),
            icon: (
              <Gear
                size={25}
                weight={
                  isPathActive(`${basePath}/profile-setting`) ? "fill" : "regular"
                }
                className={getIconClass(isPathActive(`${basePath}/profile-setting`))}
              />
            ),
          } as MenuBarItemConfig,
        ]
      : []),
    {
      key: "theme",
      label: tMenu("theme"),
      icon: <ThemeToggleMenuBar className="text-rose-500 dark:text-blue-500" />,
    },
    {
      key: "language",
      label: "",
      icon: <SwitchLanguageMenuBar className="" />,
    },
  ];

  return (
    <div className="fixed left-4 top-4 z-30 hidden font-apple md:flex">
      <div className="absolute h-[96vh] w-60 space-y-4 rounded-3xl bg-gradient-to-tr from-transparent to-zinc-50 px-3 pt-5 text-zinc-50 shadow-xl backdrop-blur-3xl dark:to-white/10">
        <>
          <div className="text-base text-black dark:text-white">
            <div className="flex items-end justify-center gap-1">
              <Link href={`/${locale}/music`} className="flex cursor-pointer">
                <ChanhdangLogotype className="w-full" />

                <div className="my-4 flex text-xs font-semibold">{tCommon("music")}</div>
              </Link>
            </div>

            <AnimatePresence>
              <motion.div
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 20,
                  duration: 0.5,
                }}
              >
                {topItems.map((item) => (
                  <MenuBarItem key={item.key} item={item} getItemClass={getItemClass} />
                ))}
              </motion.div>
            </AnimatePresence>

            <div className="mt-4 pl-3 text-xs font-medium text-zinc-500">
              {tCommon("library")}
            </div>

            {libraryItems.map((item) => (
              <MenuBarItem key={item.key} item={item} getItemClass={getItemClass} />
            ))}

            {isRegularUser && (
              <MenuBarItem
                item={{
                  key: "my-music",
                  label: tMenu("myMusic"),
                  href: `${basePath}/my-music`,
                  isActive: isPathActive(`${basePath}/my-music`),
                  icon: (
                    <UserCircle
                      size={25}
                      weight={
                        isPathActive(`${basePath}/my-music`) ? "fill" : "regular"
                      }
                      className={getIconClass(isPathActive(`${basePath}/my-music`))}
                    />
                  ),
                }}
                getItemClass={getItemClass}
              />
            )}

            {canManageSystem && (
              <MenuBarItem
                item={{
                  key: "manage-toggle",
                  label: tMenu("manage"),
                  isActive: isManageActive,
                  onClick: () => setIsDropdownOpen(!isDropdownOpen),
                  icon: (
                    <Crown
                      size={25}
                      weight={isManageActive ? "fill" : "regular"}
                      className={getIconClass(isManageActive)}
                    />
                  ),
                  trailing: (
                    <div className="mr-4 flex items-center rounded-full bg-zinc-900 p-1 dark:bg-zinc-50">
                      {isDropdownOpen ? (
                        <CaretDown
                          size={12}
                          weight="bold"
                          className="text-zinc-50 dark:text-zinc-900"
                        />
                      ) : (
                        <CaretRight
                          size={12}
                          weight="bold"
                          className="text-zinc-50 dark:text-zinc-900"
                        />
                      )}
                    </div>
                  ),
                }}
                getItemClass={getItemClass}
              />
            )}

            {canManageSystem && (
              <div>
                {isDropdownOpen && (
                  <motion.div
                    className="space-y-2 pl-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {manageItems.map((item) => (
                      <MenuBarItem
                        key={item.key}
                        item={item}
                        getItemClass={getItemClass}
                      />
                    ))}
                  </motion.div>
                )}
              </div>
            )}

            <div className="mt-4 pl-3 text-xs font-medium text-zinc-500">
              {tMenu("settings")}
            </div>

            {settingsItems.map((item) => (
              <MenuBarItem key={item.key} item={item} getItemClass={getItemClass} />
            ))}

            <div className="absolute bottom-0 left-0 flex w-full justify-center">
              <LogoutButton />
            </div>
          </div>
        </>
      </div>
    </div>
  );
}
