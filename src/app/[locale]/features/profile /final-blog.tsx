import { DrawerBlog } from "./drawer-blog";
import { SectionBlog } from "./section-blog";

export function FinalBlog() {
  return (
    <div className="">
      <div className="top-0 mx-4 font-mono text-xs text-zinc-500 md:mx-48">
        text-4xl pb-8 pt-12
      </div>

      <div className="top-0 h-px w-full bg-zinc-200 dark:bg-zinc-800" />

      <div className="mx-4 flex items-center justify-between text-balance font-mono text-3xl font-semibold leading-tight tracking-tight md:mx-48 md:text-4xl">
        <div>Blogs</div>

        <div className="text-base font-normal hover:underline">
          <DrawerBlog />
        </div>
      </div>

      <div className="top-0 h-px w-full bg-zinc-200 dark:bg-zinc-800" />

      <div className="my-8">
        <div className="top-0 h-px w-full bg-zinc-200 dark:bg-zinc-800" />

        <div className="mx-0 md:mx-48">
          <SectionBlog />
        </div>

        <div className="bottom-0 h-px w-full bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}
