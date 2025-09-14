import { ScrollHeaderPage } from "@/components/scroll-header-page";

import { readFileSync } from "fs";
import { join } from "path";
import { MDXRemote } from "next-mdx-remote/rsc";

import matter from "gray-matter";
import { Header } from "../profile /header";
import { Footer } from "../profile /footer";
import { TabPreView } from "./ component/tab-preview";

const components = {
  TabPreView,
};

export function ComponentPage() {
  const filePath = join(process.cwd(), "docs", "hello.mdx");
  console.log("Reading file:", filePath);

  const fileContent = readFileSync(filePath, "utf8");
  const { content, data } = matter(fileContent);

  console.log("Frontmatter:", data);
  console.log("Content length:", content.length);

  return (
    <div>
      <div className="fixed left-0 h-screen w-px bg-zinc-200 dark:bg-zinc-800 md:left-48" />
      <div className="fixed right-0 h-screen w-px bg-zinc-200 dark:bg-zinc-800 md:right-48" />

      <ScrollHeaderPage />

      <div className="mx-0 border border-zinc-300 p-2 dark:border-zinc-800 md:mx-48">
        <Header />
      </div>

      <div className="space-y-8 md:mt-8">
        <div>
          <div className="top-0 h-px w-full bg-zinc-200 dark:bg-zinc-800" />

          <div className="mx-4 text-balance font-mono text-3xl font-semibold leading-tight tracking-tight md:mx-48">
            {data.title ?? "Untitled"}
          </div>

          <div className="bottom-0 h-px w-full bg-zinc-200 dark:bg-zinc-800" />
        </div>

        <div className="bottom-0 h-px w-full bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <div className="mx-2 md:mx-48">
        <div className="text-balance p-4 font-mono text-base text-zinc-400">
          {data.description ?? "Untitled"}
        </div>

        <MDXRemote source={content} components={components} />
      </div>

      <Footer />
    </div>
  );
}
