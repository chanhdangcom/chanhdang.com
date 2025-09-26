import { TeckLish } from "@/components/teck-lish";
import { HeaderMotion } from "./components/header-motion";
import { FinalBlog } from "./final-blog";
import { Footer } from "./footer";
import { Header } from "./header";
import { Overview } from "./overview";
import { ScrollHeaderPage } from "@/components/scroll-header-page";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { SocialItem } from "./components/social-item";
import { ComponentList } from "./component-list";
import { WorkExperience } from "./work-experience";
import { ChanhdangMusicList } from "./chanhdang-music-list";

export const Profile = () => {
  return (
    <div>
      <div>
        <div className="fixed left-0 h-screen w-px bg-zinc-200 dark:bg-zinc-800 md:left-48" />
        <div className="fixed right-0 h-screen w-px bg-zinc-200 dark:bg-zinc-800 md:right-48" />

        <HeaderMotion />

        <ScrollHeaderPage />

        <div className="mx-0 border border-zinc-300 p-2 dark:border-zinc-800 md:mx-48">
          <Header />
        </div>

        <div className="hidden h-80 items-center justify-center pt-12 lg:flex">
          <TextHoverEffect text="DANG" />
        </div>

        <div className="space-y-8 md:my-0">
          <div>
            <div className="pointer-events-none top-0 mx-4 font-mono text-xs text-zinc-500 md:mx-48">
              text-5xl text-balance tracking-tight
            </div>

            <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-800" />

            <div className="mx-4 text-balance font-mono text-3xl font-semibold leading-tight tracking-tight md:mx-48 md:text-4xl">
              Power is not in the tools, but in the mind that codes.
            </div>

            <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-800" />
          </div>

          <div>
            <div className="top-0 h-px w-full bg-zinc-200 dark:bg-zinc-800" />

            <div className="mx-0 md:mx-48">
              <TeckLish />
            </div>

            <div className="bottom-0 h-px w-full bg-zinc-200 dark:bg-zinc-800" />
          </div>

          {/* <div>
            <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-800" />

            <div className="mx-4 text-balance font-mono text-base md:mx-48">
              From logic to life.
            </div>

            <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-800" />
          </div> */}
        </div>

        <div className="mt-8">
          <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 md:top-0" />

          <div className="mx-0 items-center justify-center md:mx-48 lg:flex">
            <div className="w-full max-w-xl">
              <Overview />
            </div>

            <div className="flex-1">
              <SocialItem
                scrImg="img/tech-stack/github.webp"
                title="Github"
                accountName="chanhdangcom"
                link="https://github.com/chanhdangcom"
              />
              <SocialItem
                scrImg="img/tech-stack/youtube.webp"
                title="Youtube"
                accountName="@nguyenchanhdang"
                link="https://www.youtube.com/@angnguyenchanh5942"
              />
              <SocialItem
                scrImg="img/tech-stack/zalo.webp"
                title="Zalo"
                accountName="0799.979.382"
              />
              <SocialItem
                scrImg="img/tech-stack/linkedin.webp"
                title="LinkedIn"
                accountName="@ncdang"
              />
              <SocialItem
                scrImg="img/tech-stack/ncdangmusic.png"
                title="ChanhDangMusic"
                accountName=""
                link="https://chanhdang.com/music"
              />
            </div>
          </div>

          <div className="bottom-0 h-px w-full bg-zinc-200 dark:bg-zinc-800" />
        </div>

        <div className="my-8">
          <WorkExperience />
        </div>

        <div className="my-8">
          <ChanhdangMusicList />
        </div>

        <div className="my-8">
          <FinalBlog />
        </div>

        <div>
          <ComponentList />
        </div>

        <Footer />
      </div>
    </div>
  );
};
