import { Hello } from "./components/hello";
import { AboutMe } from "./about-me";
import { Header } from "./header";
import { Overview } from "./overview";
import { ExperienceList } from "./experience-list";
import { Confetti } from "./components/confetti";
import { Footer } from "./footer";

import { SectionBlog } from "./section-blog";
import { PhotoListAnimate } from "./photo-list-animate";
import { MusicList } from "./music-list";

import { ScrollHeaderPage } from "@/components/scroll-header-page";
import { HeaderMotion } from "./components/header-motion";

export const Profile = () => {
  return (
    <>
      <Header />
      <HeaderMotion />

      <div className="relative">
        <div className="absolute left-0 top-8 -z-[1] h-[calc(100vh-120px)] rounded-3xl dark:bg-zinc-900/30 md:w-2/6 xl:bg-zinc-100"></div>

        <div className="container space-y-8 xl:px-16">
          <div className="min-h-[calc(100vh-56px)] items-center space-y-8 md:flex md:space-y-0">
            <Hello className="mt-8 md:hidden" />

            <div className="grid items-center gap-x-16 md:grid-cols-2 xl:gap-x-28">
              <Overview />
              <AboutMe />
            </div>
          </div>
        </div>

        <div className="container my-8 justify-center md:flex md:items-center">
          <PhotoListAnimate />
        </div>

        <div className="container max-w-4xl">
          <ExperienceList />
        </div>

        <div className="container my-8 max-w-4xl">
          <MusicList />
        </div>

        <div className="container my-8 max-w-4xl">
          <SectionBlog />
        </div>

        <div className="container my-8">
          <Footer />
        </div>
      </div>

      <div className="m-8">
        <ScrollHeaderPage />
      </div>
      <Confetti />
    </>
  );
};
