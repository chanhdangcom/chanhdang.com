"use client";

import { Button } from "@/components/button-new";
// import { Button } from "@/components/button";
import { Hello } from "./components/hello";
import { TechStack } from "./tech-stack";
import { CodeTag } from "@/components/code-tag";
import { PauseIcon, PlayCircleIcon } from "lucide-react";
import { useAudio } from "@/components/music-provider";

export const AboutMe = () => {
  const { handlePlayAudio, handlePauseAudio } = useAudio();

  // const handleClick = () => {
  //   window.location.href = "/#work";
  // };

  return (
    <div className="space-y-8 dark:text-slate-50">
      <Hello className="hidden md:block" />
      {/* <div className="space-x-4 text-center">
        <Button type="primary" onClick={handleClick}>
          Work
        </Button>
        <Button type="secondary">Project</Button>
      </div> */}
      <div className="text-balance text-center font-mono text-sm">
        <CodeTag tagName="About" className="text-cyan-500 dark:text-cyan-400" />
        I am passionate about creating and developing web applications and
        software, always looking for the most optimal and efficient solutions.
        With experience in using modern technologies such as TypeScript, React
        and Tailwind CSS. I love learning and applying new technologies.
        <CodeTag
          tagName="About"
          className="text-cyan-500 dark:text-cyan-400"
          isCloseTag
        />
      </div>
      <TechStack />

      <div>
        <Button
          onClick={() =>
            handlePlayAudio(
              "https://res.cloudinary.com/dj4iqdbrf/video/upload/v1741094860/demo_73a6d119fd.mp3"
            )
          }
        >
          <PlayCircleIcon />
          Play
        </Button>

        <Button
          onClick={() =>
            handlePlayAudio(
              "https://res.cloudinary.com/dj4iqdbrf/video/upload/v1741094860/tet_background_music_18cc3aa312.mp3"
            )
          }
        >
          <PlayCircleIcon />
          Play2
        </Button>

        <Button onClick={handlePauseAudio}>
          <PauseIcon />
          Pause
        </Button>
      </div>

      {/* <div className="mb-10 flex w-full flex-row items-center justify-center">
        <AnimatedTooltip items={TECHSTACK} />
      </div> */}
    </div>
  );
};
