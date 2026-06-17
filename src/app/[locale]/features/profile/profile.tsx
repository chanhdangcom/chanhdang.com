import { HeaderMotion } from "./components/header-motion";
import { Footer } from "./footer";
import { Header } from "./header";
import { Overview } from "./overview";
import { ScrollHeaderPage } from "@/components/scroll-header-page";
import { SocialItem } from "./components/social-item";
import { ComponentList } from "./component-list";
import { WorkExperience } from "./work-experience";
import { ChanhdangMusicList } from "./chanhdang-music-list";
import { TitleIntro } from "./components/title-intro";
import { ScrollChatBot } from "@/components/scroll-chat-bot";
import { GitHubChart } from "./github-chart";
import { ProjectList } from "./project-list";
import { FinalBlog } from "./final-blog";
import { MagicCaroReview } from "./magic-caro-review";
import { MarqueeList } from "./marquee-list";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

export const Profile = () => {
  return (
    <div>
      <div className="fixed left-0 z-50 h-screen w-px bg-zinc-200 dark:bg-zinc-900 md:left-[25vw]" />
      <div className="fixed right-0 z-50 h-screen w-px bg-zinc-200 dark:bg-zinc-900 md:right-[25vw]" />

      <HeaderMotion />

      <ScrollHeaderPage />

      <ScrollChatBot />

      <header className="mx-0 border border-zinc-200 p-2 dark:border-zinc-900 md:mx-[25vw]">
        <Header />
      </header>

      <main id="main-content">
        <div className="mx-[20vw] hidden items-center justify-center pt-8 lg:flex">
          <TextHoverEffect text="DANG" />
        </div>

        <TitleIntro />

        <section aria-labelledby="overview-heading" className="mt-8">
          <div className="h-px w-full bg-zinc-200 dark:bg-zinc-900 md:top-0" />

          <>
            <div className="mx-0 mb-2 md:mx-[25vw]">
              <div className="w-full">
                <h2 id="overview-heading" className="sr-only">
                  Professional overview and contact details
                </h2>

                <Overview />
              </div>
            </div>

            <div className="w-full border-t border-zinc-200 dark:border-zinc-900" />

            <div className="mx-0 flex-1 border-l dark:border-zinc-900 md:mx-[25vw]">
              <h3 className="sr-only">Social profiles</h3>

              <ul className="grid md:grid-cols-2" role="list">
                <li>
                  <SocialItem
                    scrImg="img/tech-stack/github.webp"
                    title="Github"
                    accountName="chanhdangcom"
                    link="https://github.com/chanhdangcom"
                    className="border-b border-r"
                  />
                </li>

                <li>
                  <SocialItem
                    scrImg="img/tech-stack/youtube.webp"
                    title="Youtube"
                    accountName="@nguyenchanhdang"
                    link="https://www.youtube.com/@angnguyenchanh5942"
                    className="border-b"
                  />
                </li>

                <li>
                  <SocialItem
                    scrImg="img/tech-stack/zalo.webp"
                    title="Zalo"
                    accountName="0799.979.382"
                    className="border-b border-r"
                  />
                </li>

                <li>
                  <SocialItem
                    scrImg="img/tech-stack/tiktok.webp"
                    title="TikTok"
                    accountName="Nguyễn Chánh Đang"
                    link="https://www.tiktok.com/@nguyn.chnh.ang?_r=1&_t=ZS-93VIr5WDiwX"
                    className="border-b"
                  />
                </li>

                <li>
                  <SocialItem
                    scrImg="img/tech-stack/linkedin.webp"
                    title="LinkedIn"
                    accountName="@ncdang"
                    className="border-r"
                  />
                </li>

                <li>
                  <SocialItem
                    scrImg="img/tech-stack/ncdangmusic.png"
                    title="ChanhDangMusic"
                    accountName=""
                    link="https://chanhdang.com/music"
                    className=""
                  />
                </li>
              </ul>
            </div>
          </>

          <div className="bottom-0 h-px w-full bg-zinc-200 dark:bg-zinc-900" />
        </section>

        <div className="relative my-8 border-x border-zinc-200 px-1 dark:border-zinc-700 md:mx-[25vw]">
          <MarqueeList />

          <div className="pointer-events-none absolute -left-3 top-0 z-10 h-full w-12 bg-zinc-50 blur-md dark:bg-black" />

          <div className="pointer-events-none absolute -right-3 top-0 z-10 h-full w-12 bg-zinc-50 blur-md dark:bg-black" />
        </div>

        <div className="my-8">
          <WorkExperience />
        </div>

        <div className="my-8">
          <ProjectList />
        </div>

        <div className="my-8">
          <ChanhdangMusicList />
        </div>

        <div className="my-8">
          <FinalBlog />
        </div>

        <ComponentList />

        <MagicCaroReview />

        <div className="my-8">
          <GitHubChart />
        </div>
      </main>

      <Footer />
    </div>
  );
};
