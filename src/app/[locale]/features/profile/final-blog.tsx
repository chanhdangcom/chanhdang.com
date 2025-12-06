import { DrawerBlog } from "./drawer-blog";
import { SectionBlog } from "./section-blog";

export function FinalBlog() {
  return (
    <section aria-labelledby="blog-heading">
      <p className="top-0 mx-4 font-mono text-xs text-zinc-500 md:mx-[15vw]">
        flex items-center justify-between text-4xl
      </p>

      <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-900" />

      <div className="mx-4 flex items-center justify-between text-balance font-mono text-3xl font-semibold leading-tight tracking-tight md:mx-[15vw] md:text-4xl">
        <h2 id="blog-heading">Blogs</h2>

        <div className="text-base font-normal hover:underline">
          <DrawerBlog />
        </div>
      </div>

      <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-900" />

      <div className="my-8">
        <div className="top-0 h-px w-full bg-zinc-200 dark:bg-zinc-900" />

        <div className="mx-0 md:mx-[15vw]">
          <SectionBlog />
        </div>

        <div className="bottom-0 h-px w-full bg-zinc-200 dark:bg-zinc-900" />
      </div>
    </section>
  );
}
