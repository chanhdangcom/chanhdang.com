import { Footer } from "@/app/[locale]/features/profile/footer";
import { AudioBar } from "../audio-bar";
import { MenuBarMobile } from "../menu-bar-mobile";
import { MotionHeaderMusic } from "../component/motion-header-music";
import { MenuBar } from "../menu-bar";
import { SearchSection } from "./search-section";
import { SearchClient } from "./search-client";

export function PageSearch() {
  return (
    <>
      <div className="flex font-apple">
        <MotionHeaderMusic />

        <MenuBar />

        <div className="pointer-events-none fixed bottom-0 z-50 h-16 w-full bg-gradient-to-t from-white to-transparent dark:from-black" />

        <div className="mx-auto w-full">
          <div className="relative z-10 mt-20 md:mt-8">
            <>
              <SearchSection />

              <SearchClient />

              <div className="md:ml-60">
                <Footer />
              </div>
            </>
          </div>

          <div className="my-40">
            <AudioBar />
            <MenuBarMobile />
          </div>
        </div>
      </div>
    </>
  );
}
