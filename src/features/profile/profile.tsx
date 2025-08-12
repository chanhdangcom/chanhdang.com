import { Hello } from "./components/hello";
import { AboutMe } from "./about-me";
import { Header } from "./header";
import { Overview } from "./overview";
import { ExperienceList } from "./experience-list";
import { Confetti } from "./components/confetti";
import { Footer } from "./footer";

import { SectionBlog } from "./section-blog";

import { ScrollHeaderPage } from "@/components/scroll-header-page";
import { HeaderMotion } from "./components/header-motion";
import { WavyBackground } from "@/components/ui/wavy-background";
import { MusicList } from "./music-list";
import { PhotoListAnimate } from "./photo-list-animate";

export const Profile = () => {
  return (
    <div>
      <Header />
      <HeaderMotion />

      <div className="relative w-full">
        <Hello className="my-8 md:hidden" />

        <WavyBackground className="mx-auto">
          <div className="container space-y-8 xl:px-16">
            <div className="min-h-[calc(100vh-56px)] items-center space-y-8 md:flex md:space-y-0">
              <div className="grid items-center gap-x-16 md:grid-cols-2 xl:gap-x-28">
                <Overview />
                <AboutMe />
              </div>
            </div>
          </div>
        </WavyBackground>

        <div className="relative top-0 h-[1px] w-full bg-zinc-200 dark:bg-zinc-800"></div>

        <>
          <div className="absolute flex h-full w-8 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-foreground)_0,_var(--pattern-foreground)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] [--pattern-foreground:#e4e4e7] dark:[--pattern-foreground:#27272a]" />
          <div className="absolute right-0 flex h-full w-8 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-foreground)_0,_var(--pattern-foreground)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] [--pattern-foreground:#e4e4e7] dark:[--pattern-foreground:#27272a]" />
        </>

        <div className="relative mx-8 justify-between rounded-3xl md:flex">
          <>
            <div className="absolute left-1/2 top-0 hidden h-full w-[1px] bg-zinc-200 dark:bg-zinc-800 md:flex" />
            <div className="absolute left-0 top-0 h-full w-[1px] bg-zinc-200 dark:bg-zinc-800" />
            <div className="absolute right-0 top-0 h-full w-[1px] bg-zinc-200 dark:bg-zinc-800" />
          </>

          <div className="bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:12px_12px] md:w-1/2">
            <ExperienceList />
          </div>

          <div className="bg-zinc-100 dark:bg-zinc-900 md:w-1/2">
            <div className="m-1 rounded-3xl border border-zinc-200 bg-zinc-50 bg-[radial-gradient(circle,rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[size:12px_12px] dark:border-zinc-800 dark:bg-[#030610] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)]">
              <PhotoListAnimate />
            </div>

            <>
              <div className="relative top-0 h-[1px] w-full bg-zinc-200 dark:bg-zinc-800"></div>
              <div className="flex h-8 w-full bg-zinc-50 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-foreground)_0,_var(--pattern-foreground)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] [--pattern-foreground:#e4e4e7] dark:bg-[#030610] dark:[--pattern-foreground:#27272a]" />
              <div className="relative bottom-0 h-[1px] w-full bg-zinc-200 dark:bg-zinc-800"></div>
            </>

            <div className="m-1 rounded-3xl border border-zinc-200 bg-zinc-50 bg-[radial-gradient(circle,rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[size:12px_12px] dark:border-zinc-800 dark:bg-[#030610] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)]">
              <MusicList />
            </div>

            <>
              <div className="relative top-0 h-[1px] w-full bg-zinc-200 dark:bg-zinc-800"></div>
              <div className="flex h-8 w-full bg-zinc-50 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-foreground)_0,_var(--pattern-foreground)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] [--pattern-foreground:#e4e4e7] dark:bg-[#030610] dark:[--pattern-foreground:#27272a]" />
              <div className="relative bottom-0 h-[1px] w-full bg-zinc-200 dark:bg-zinc-800"></div>
            </>

            <div className="m-1 rounded-3xl border border-zinc-200 bg-zinc-50 bg-[radial-gradient(circle,rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[size:12px_12px] dark:border-zinc-800 dark:bg-[#030610] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)]">
              <SectionBlog />
            </div>

            <>
              <div className="relative top-0 h-[1px] w-full bg-zinc-200 dark:bg-zinc-800"></div>
              <div className="flex h-8 w-full bg-zinc-50 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-foreground)_0,_var(--pattern-foreground)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] [--pattern-foreground:#e4e4e7] dark:bg-[#030610] dark:[--pattern-foreground:#27272a]" />
              <div className="relative bottom-0 h-[1px] w-full bg-zinc-200 dark:bg-zinc-800"></div>
            </>

            <div className="bg-zinc-50 dark:bg-[#030610]">
              <Footer />
            </div>
          </div>
        </div>
      </div>

      <div className="relative bottom-0 h-[1px] w-full bg-zinc-200 dark:bg-zinc-800"></div>

      <div className="m-8">
        <ScrollHeaderPage />
      </div>

      <Confetti />
    </div>
  );
};
