/* eslint-disable @next/next/no-img-element */
"use client";

import { useTranslations } from "next-intl";
import { useUser } from "@/hooks/use-user";
import { usePermissions } from "@/hooks/use-permissions";
import {
  BookBookmark,
  Browsers,
  CardsThree,
  CaretDown,
  CaretRight,
  ChartDonut,
  Clock,
  Crown,
  Faders,
  Gear,
  House,
  MicrophoneStage,
  MusicNote,
  MusicNotesSimple,
  Playlist,
  SealCheck,
  ShieldCheck,
  SketchLogo,
  SquaresFour,
} from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { MagnifyingGlass } from "phosphor-react";
import { LogoutButton } from "./component/logout-button";
import { useEffect, useState } from "react";
import { SwitchLanguageMenuBar } from "@/app/[locale]/features/profile/components/swtich-language-menu-bar";
import { ThemeToggleMenuBar } from "@/components/theme-toggle-menubar";
import { cn } from "@/lib/utils";
import { MenuBarItem, type MenuBarItemConfig } from "./component/menu-bar-item";
import { ChanhdangLogotypeMusic } from "@/components/chanhdang-logotype-music";
import { usePremium } from "@/hooks/use-premium";
import { useTheme } from "next-themes";

const MENU_BAR_OPEN_STORAGE_KEY = "music-menu-bar-open";

function getInitialMenuBarOpen() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.localStorage.getItem(MENU_BAR_OPEN_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function MenuBar() {
  const params = useParams();
  const pathname = usePathname();
  const locale = (params?.locale as string) || "vi";
  const { isAuthenticated } = useUser();
  const { isPremium } = usePremium();
  const {
    canAddMusic,
    canAddSinger,
    canManageSystem,
    canUseLibrary,
    role,
    isLoading: isPermissionsLoading,
  } = usePermissions();
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
    cn("text-rose-500", active && "text-rose-600");

  const isManageHubActive = isPathActive(`${basePath}/management-page`);
  const isAdminPanelActive = isPathActive(`${basePath}/admin`);
  const isAddMusicActive = isPathActive(`${basePath}/add-music`);
  const isAddSingerActive = isPathActive(`${basePath}/add-singer`);
  const { theme } = useTheme();

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

  const libraryItems: MenuBarItemConfig[] =
    isAuthenticated && isPermissionsLoading
      ? [
          {
            key: "recently-played-loading",
            label: tMenu("recentlyPlayed"),
            href: `${basePath}/recently-played`,
            disabled: true,
            icon: <Clock size={25} className="text-rose-500" />,
          },
          {
            key: "library-loading",
            label: tCommon("library"),
            href: `${basePath}/library`,
            disabled: true,
            icon: <BookBookmark size={25} className="text-rose-500" />,
          },
        ]
      : isAuthenticated && canUseLibrary
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
                  isPathActive(`${basePath}/recently-played`)
                    ? "fill"
                    : "regular"
                }
                className={getIconClass(
                  isPathActive(`${basePath}/recently-played`)
                )}
              />
            ),
          },
          {
            key: "artists",
            label: tCommon("artists"),
            href: `${basePath}/library/artists`,
            isActive: isPathActive(`${basePath}/library/artists`),
            icon: (
              <MicrophoneStage
                size={25}
                weight={
                  isPathActive(`${basePath}/library/artists`)
                    ? "fill"
                    : "regular"
                }
                className={getIconClass(
                  isPathActive(`${basePath}/library/artists`)
                )}
              />
            ),
          },
          {
            key: "playlists",
            label: "Playlists",
            href: `${basePath}/library/playlists`,
            isActive: isPathActive(`${basePath}/library/playlists`),
            icon: (
              <Playlist
                size={25}
                weight={
                  isPathActive(`${basePath}/library/playlists`)
                    ? "fill"
                    : "regular"
                }
                className={getIconClass(
                  isPathActive(`${basePath}/library/playlists`)
                )}
              />
            ),
          },
          {
            key: "library",
            label: tCommon("library"),
            href: `${basePath}/library`,
            isActive: isPathActive(`${basePath}/library`, true),
            icon: (
              <CardsThree
                size={25}
                weight={
                  isPathActive(`${basePath}/library`, true) ? "fill" : "regular"
                }
                className={getIconClass(
                  isPathActive(`${basePath}/library`, true)
                )}
              />
            ),
          },
          {
            key: "songs",
            label: tCommon("songs"),
            href: `${basePath}/library/favorites`,
            isActive: isPathActive(`${basePath}/library/favorites`),
            icon: (
              <MusicNote
                size={25}
                weight={
                  isPathActive(`${basePath}/library/favorites`)
                    ? "fill"
                    : "regular"
                }
                className={getIconClass(
                  isPathActive(`${basePath}/library/favorites`)
                )}
              />
            ),
          },
        ]
      : isAuthenticated
        ? [
            {
              key: "recently-played-disabled-premium",
              label: tMenu("recentlyPlayed"),
              href: `${basePath}/recently-played`,
              disabled: true,
              icon: <Clock size={25} className="text-rose-500" />,
            },
            {
              key: "library-disabled-premium",
              label: tCommon("library"),
              href: `${basePath}/premium`,
              disabled: false,
              icon: <BookBookmark size={25} className="text-rose-500" />,
            },
          ]
        : [
            {
              key: "recently-played-disabled",
              label: tMenu("recentlyPlayed"),
              href: `${basePath}/recently-played`,
              disabled: true,
              icon: <Clock size={25} className="text-rose-500" />,
            },
            {
              key: "library-disabled",
              label: tCommon("library"),
              href: `${basePath}/library`,
              disabled: true,
              icon: <BookBookmark size={25} className="text-rose-500" />,
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

    {
      key: "approve-musics",
      label: tMenu("approveMusics"),
      href: `${basePath}/pending-musics`,
      isActive: isPathActive(`${basePath}/pending-musics`),
      disabled: !canManageSystem,
      icon: (
        <SealCheck
          size={25}
          weight={
            isPathActive(`${basePath}/pending-musics`) ? "fill" : "regular"
          }
          className={getIconClass(isPathActive(`${basePath}/pending-musics`))}
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
                  isPathActive(`${basePath}/profile-setting`)
                    ? "fill"
                    : "regular"
                }
                className={getIconClass(
                  isPathActive(`${basePath}/profile-setting`)
                )}
              />
            ),
          } as MenuBarItemConfig,
          {
            key: "premium",
            label: tMenu("premium"),
            href: `${basePath}/premium`,
            isActive: isPathActive(`${basePath}/premium`),
            icon: (
              <SketchLogo
                size={25}
                weight={
                  isPathActive(`${basePath}/premium`) ? "fill" : "regular"
                }
                className={getIconClass(isPathActive(`${basePath}/premium`))}
              />
            ),
          } as MenuBarItemConfig,
        ]
      : [
          {
            key: "premium",
            label: tMenu("premium"),
            href: `${basePath}/premium`,
            isActive: isPathActive(`${basePath}/premium`),
            icon: (
              <SketchLogo
                size={25}
                weight={
                  isPathActive(`${basePath}/premium`) ? "fill" : "regular"
                }
                className={getIconClass(isPathActive(`${basePath}/premium`))}
              />
            ),
          } as MenuBarItemConfig,
        ]),
    {
      key: "theme",
      label: tMenu("theme"),
      icon: <ThemeToggleMenuBar className="text-rose-500" />,
    },
    {
      key: "language",
      label: "",
      icon: <SwitchLanguageMenuBar className="" />,
    },
  ];

  const [isMenuBarOpen, setIsMenuBarOpen] = useState(getInitialMenuBarOpen);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        MENU_BAR_OPEN_STORAGE_KEY,
        isMenuBarOpen ? "true" : "false"
      );
    } catch {
      // Ignore storage errors so the menu still works normally.
    }
  }, [isMenuBarOpen]);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "music-menu-bar-closed",
      !isMenuBarOpen
    );

    return () => {
      document.documentElement.classList.remove("music-menu-bar-closed");
    };
  }, [isMenuBarOpen]);
  const menuBarTransition = {
    type: "spring",
    stiffness: 350,
    damping: 40,
  } as const;

  return (
    <AnimatePresence initial={false}>
      {!isMenuBarOpen ? (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-30 hidden justify-center md:flex">
          <motion.div
            key="collapsed-menu-bar"
            layoutId="menu-bar"
            transition={menuBarTransition}
            layout
            className="pointer-events-auto rounded-full border border-black/10 bg-white/80 font-apple backdrop-blur-sm dark:border-white/10 dark:bg-black/40"
          >
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="flex items-center justify-between gap-8 px-4 py-2"
            >
              <div
                className=""
                onClick={() => setIsMenuBarOpen(!isMenuBarOpen)}
              >
                <Browsers size={20} className="text-zinc-400" />
              </div>

              <Link
                href={`/${locale}/music`}
                className={cn(
                  "font-medium transition-colors",
                  isPathActive(basePath, true) && "text-rose-500"
                )}
              >
                Home
              </Link>

              <Link
                href={`/${locale}/music/new-release`}
                className={cn(
                  "font-medium transition-colors",
                  isPathActive(`${basePath}/new-release`) && "text-rose-500"
                )}
              >
                New
              </Link>

              <div className="font-medium">Radio</div>

              <div className="font-medium">Recently Played</div>

              <Link
                href={`/${locale}/music/search`}
                className={cn(
                  "font-medium text-zinc-400 transition-colors",
                  isPathActive(`${basePath}/search`) && "text-rose-500"
                )}
              >
                <MagnifyingGlass size={20} className="" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      ) : (
        <div className="fixed left-4 top-4 z-30 hidden font-apple md:block">
          <motion.div
            key="expanded-menu-bar"
            layoutId="menu-bar"
            layout
            transition={menuBarTransition}
            initial={{ opacity: 0.88, x: -18, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0.9, x: 18, y: -8, scale: 0.98 }}
            className="h-[96vh] w-60 origin-top-left space-y-4 overflow-hidden overflow-y-auto rounded-3xl bg-gradient-to-tr from-transparent to-zinc-50 px-3 pb-8 pt-5 text-zinc-50 shadow-xl backdrop-blur-3xl dark:to-white/10"
          >
            <>
              <div className="text-base text-black dark:text-white">
                <div className="mb-4 flex flex-col items-center justify-center gap-0.5">
                  <Link
                    href={`/${locale}/music`}
                    className="flex cursor-pointer items-center gap-1.5"
                  >
                    {isPremium ? (
                      theme === "dark" ? (
                        <img
                          src="/img/logo/Logotype Premium (Dark).svg"
                          alt="Premium"
                          className="w-28"
                        />
                      ) : (
                        <img
                          src="/img/logo/Logotype Premium (Light).svg"
                          alt="Premium"
                          className="w-28"
                        />
                      )
                    ) : (
                      <ChanhdangLogotypeMusic height={28} className="w-auto" />
                    )}
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
                      <MenuBarItem
                        key={item.key}
                        item={item}
                        getItemClass={getItemClass}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>

                <div className="mb-2 mt-4 pl-3 font-medium text-zinc-400">
                  {tCommon("library")}
                </div>

                {libraryItems.map((item) => (
                  <MenuBarItem
                    key={item.key}
                    item={item}
                    getItemClass={getItemClass}
                  />
                ))}

                {isRegularUser && (
                  <MenuBarItem
                    item={{
                      key: "my-music",
                      label: tMenu("myMusic"),
                      href: `${basePath}/my-music`,
                      isActive: isPathActive(`${basePath}/my-music`),
                      icon: (
                        <Faders
                          size={25}
                          weight={
                            isPathActive(`${basePath}/my-music`)
                              ? "fill"
                              : "regular"
                          }
                          className={getIconClass(
                            isPathActive(`${basePath}/my-music`)
                          )}
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
                        <div className="">
                          {isDropdownOpen ? (
                            <CaretDown size={18} weight="bold" className="" />
                          ) : (
                            <CaretRight size={18} weight="bold" className="" />
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
                        className="mt-1.5 space-y-2 pl-4"
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

                <div className="mb-2 mt-4 pl-3 font-medium text-zinc-400">
                  {tMenu("settings")}
                </div>

                {settingsItems.map((item) => (
                  <MenuBarItem
                    key={item.key}
                    item={item}
                    getItemClass={getItemClass}
                  />
                ))}

                <div className="absolute -m-3 mt-auto flex w-full items-end justify-center pt-4">
                  <LogoutButton />
                </div>

                <div
                  className="absolute right-3 top-3"
                  onClick={() => setIsMenuBarOpen(!isMenuBarOpen)}
                >
                  <Browsers size={20} className="text-zinc-400" />
                </div>
              </div>
            </>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
