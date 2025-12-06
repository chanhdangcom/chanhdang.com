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
import { TitleIntro } from "./components/title-intro";
import { ScrollChatBot } from "@/components/scroll-chat-bot";
import { GitHubChart } from "./github-chart";
import { ProjectList } from "./project-list";

export const Profile = () => {
  return (
    <div>
      <div className="fixed left-0 h-screen w-px bg-zinc-200 dark:bg-zinc-900 md:left-[15vw]" />
      <div className="fixed right-0 h-screen w-px bg-zinc-200 dark:bg-zinc-900 md:right-[15vw]" />

      <HeaderMotion />

      <ScrollHeaderPage />

      <ScrollChatBot />

      <header className="mx-0 border border-zinc-300 p-2 dark:border-zinc-900 md:mx-[15vw]">
        <Header />
      </header>

      <main id="main-content">
        <div className="hidden h-80 items-center justify-center pt-12 lg:flex">
          <TextHoverEffect text="DANG" />
        </div>

        <TitleIntro />

        <section aria-labelledby="overview-heading" className="mt-8">
          <div className="h-px w-full bg-zinc-200 dark:bg-zinc-900 md:top-0" />

          <div className="mx-0 items-center justify-center md:mx-[15vw] lg:flex">
            <div className="w-full max-w-xl">
              <h2 id="overview-heading" className="sr-only">
                Professional overview and contact details
              </h2>

              <Overview />
            </div>

            <div className="flex-1">
              <h3 className="sr-only">Social profiles</h3>
              <ul className="flex flex-col" role="list">
                <li>
                  <SocialItem
                    scrImg="img/tech-stack/github.webp"
                    title="Github"
                    accountName="chanhdangcom"
                    link="https://github.com/chanhdangcom"
                  />
                </li>
                <li>
                  <SocialItem
                    scrImg="img/tech-stack/youtube.webp"
                    title="Youtube"
                    accountName="@nguyenchanhdang"
                    link="https://www.youtube.com/@angnguyenchanh5942"
                  />
                </li>
                <li>
                  <SocialItem
                    scrImg="img/tech-stack/zalo.webp"
                    title="Zalo"
                    accountName="0799.979.382"
                  />
                </li>
                <li>
                  <SocialItem
                    scrImg="img/tech-stack/linkedin.webp"
                    title="LinkedIn"
                    accountName="@ncdang"
                  />
                </li>
                <li>
                  <SocialItem
                    scrImg="img/tech-stack/ncdangmusic.png"
                    title="ChanhDangMusic"
                    accountName=""
                    link="https://chanhdang.com/music"
                  />
                </li>
              </ul>
            </div>
          </div>

          <div className="bottom-0 h-px w-full bg-zinc-200 dark:bg-zinc-900" />
        </section>

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

        <div className="my-8">
          <GitHubChart />
        </div>
      </main>

      <Footer />
    </div>
  );
};
