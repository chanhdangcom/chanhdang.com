import { Hello } from "./components/hello";
import { AboutMe } from "./about-me";
import { Header } from "./header";
import { Overview } from "./overview";
import { ExperienceList } from "./experience-list";
import { Confetti } from "./components/confetti";

import { SectionBlog } from "./section-blog";

import { ScrollHeaderPage } from "@/components/scroll-header-page";
import { HeaderMotion } from "./components/header-motion";

import { PhotoListAnimate } from "./photo-list-animate";
import { TailwindStyle } from "./components/taiwind-style";
import { TableRanking } from "@/features/music/table-ranking";
import { Footer } from "./footer";
import { ComponentList } from "./component-list";
import { DrawerBlog } from "./drawer-blog";
import Link from "next/link";

export const Profile = () => {
  return (
    <div>
      <TailwindStyle />

      <div className="mx-4 md:mx-8">
        <div className="border-x border-zinc-200 py-2 dark:border-zinc-800">
          <Header />
        </div>

        <HeaderMotion />

        <div className="relative top-0 hidden h-[1px] w-full bg-zinc-200 dark:bg-zinc-800 md:block"></div>

        <div className="w-full">
          <>
            <div className="h-full border border-zinc-200 bg-zinc-50 bg-[radial-gradient(circle,rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[size:12px_12px] dark:border-zinc-800 dark:bg-[#030610] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)] md:hidden">
              <Hello className="my-8" />
            </div>
          </>

          <div className="space-y-8">
            <div className="min-h-[calc(100px-60px)] items-center space-y-8 md:flex md:space-y-0">
              <div className="justify-between border-r border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 md:flex">
                <div className="border-b border-l border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-[#030610] md:w-1/3 md:rounded-none md:border-none">
                  <Overview />
                </div>

                <div className="bg-zinc-100 p-2 dark:bg-zinc-900 md:w-2/3">
                  <div className="h-full rounded-3xl border border-zinc-200 bg-zinc-50 bg-[radial-gradient(circle,rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[size:12px_12px] dark:border-zinc-800 dark:bg-[#030610] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)]">
                    <div className="md:mt-20">
                      <AboutMe />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <TailwindStyle useX />
          </div>

          <div className="relative justify-between rounded-3xl md:flex">
            <div className="absolute left-1/2 top-0 hidden h-full w-[1px] bg-zinc-200 dark:bg-zinc-800 md:flex" />
            <div className="absolute left-1/2 top-0 hidden h-full w-[1px] bg-zinc-200 dark:bg-zinc-800 md:flex" />

            <TailwindStyle useX />

            <div className="bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:12px_12px] md:w-1/2">
              <ExperienceList />
            </div>

            <div className="bg-zinc-100 dark:bg-zinc-900 md:w-1/2">
              <div className="m-2 rounded-3xl border border-zinc-200 bg-zinc-50 bg-[radial-gradient(circle,rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[size:12px_12px] dark:border-zinc-800 dark:bg-[#030610] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)]">
                <PhotoListAnimate />
              </div>

              <TailwindStyle useX />

              <div className="m-2 rounded-[28px] border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-[#030610]">
                <div className="text-3xl font-semibold">
                  <Link href={"/music"} className="">
                    <div className="m-2 rounded-[40px] border border-zinc-200 px-4 py-2 text-2xl font-semibold dark:border-zinc-800">
                      ChanhDang Music
                    </div>
                  </Link>
                </div>

                <div className="m-2 rounded-3xl border border-zinc-200 bg-zinc-50 bg-[radial-gradient(circle,rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[size:12px_12px] dark:border-zinc-800 dark:bg-[#030610] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)]">
                  <TableRanking none />
                </div>
              </div>

              <TailwindStyle useX />

              <div className="m-2 rounded-[32px] border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-[#030610]">
                <div className="m-2 rounded-[40px] border border-zinc-200 px-4 py-2 text-2xl font-semibold dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div>Blogs</div>

                    <div className="text-base font-normal underline">
                      <DrawerBlog />
                    </div>
                  </div>
                </div>

                <div className="m-2">
                  <SectionBlog />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-4 md:mx-8">
        <TailwindStyle useX />
      </div>

      <div className="mx-4 bg-zinc-100 p-2 dark:bg-zinc-900 md:mx-8">
        <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-[#030610]">
          <ComponentList />
        </div>
      </div>

      <div className="mx-4 md:mx-8">
        <TailwindStyle useX />
      </div>

      <div className="bg-zinc-50 dark:bg-[#030610]">
        <Footer />
      </div>

      <div className="relative bottom-0 h-[1px] w-full bg-zinc-200 dark:bg-zinc-800"></div>

      <div className="m-8">
        <ScrollHeaderPage />
      </div>

      <Confetti />
    </div>
  );
};
