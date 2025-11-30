import { ExperienceList } from "./experience-list";

export function WorkExperience() {
  return (
    <section aria-labelledby="experience-heading">
      <p className="top-0 mx-4 font-mono text-xs text-zinc-500 md:mx-48">
        text-4xl text-balance font-mono
      </p>

      <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-900" />

      <h2
        id="experience-heading"
        className="mx-4 flex text-balance font-mono text-3xl font-semibold leading-tight tracking-tight md:mx-48 md:text-4xl"
      >
        Work Experience
      </h2>

      <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-900" />

      <div className="my-8">
        <div className="top-0 h-px w-full bg-zinc-200 dark:bg-zinc-900" />

        <div className="mx-0 md:mx-48">
          <ExperienceList />
        </div>

        <div className="bottom-0 h-px w-full bg-zinc-200 dark:bg-zinc-900" />
      </div>
    </section>
  );
}
