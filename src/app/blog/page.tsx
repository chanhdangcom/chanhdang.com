import { BlogListPage } from "../[locale]/features/profile /blog-list-page";
import { Footer } from "../[locale]/features/profile /footer";
import { Header } from "../[locale]/features/profile /header";

export default function Page() {
  return (
    <div>
      <div className="fixed left-0 h-screen w-px bg-zinc-200 dark:bg-zinc-900 md:left-48" />
      <div className="fixed right-0 h-screen w-px bg-zinc-200 dark:bg-zinc-900 md:right-48" />
      <div className="mx-0 border border-zinc-300 p-2 dark:border-zinc-900 md:mx-48">
        <Header />
      </div>

      <div className="mt-6">
        <div className="top-0 mx-4 font-mono text-xs text-zinc-500 md:mx-48">
          text-4xl pb-8 pt-12
        </div>

        <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-900" />

        <div className="mx-4 text-balance font-mono text-4xl font-semibold leading-tight tracking-tight md:mx-48">
          <div>Blogs</div>
        </div>

        <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-900" />
      </div>

      <div className="mt-8">
        <div className="top-0 h-px w-full bg-zinc-200 dark:bg-zinc-900" />

        <div className="md:mx-48">
          <BlogListPage />
        </div>
      </div>
      <Footer />
    </div>
  );
}
