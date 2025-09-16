import { ScrollHeaderPage } from "@/components/scroll-header-page";

import { readFileSync } from "fs";
import { join } from "path";
import { MDXRemote } from "next-mdx-remote/rsc";

import matter from "gray-matter";
import { Header } from "../profile /header";
import { Footer } from "../profile /footer";
import { TabPreView } from "@/components/ui/tab-preview";
import CodeBlock from "./ component/code-block";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { TabInstall } from "./ component/tab-install";

import { TabGroup, TabPanel } from "./ component/tab-group";

const components = {
  TabPreView,
  CodeBlock,
  ThemeSwitcher,
  TabInstall,
  TabGroup,
  TabPanel,
};

export function ComponentPage() {
  const filePath = join(process.cwd(), "docs", "hello.mdx");
  console.log("Reading file:", filePath);

  const fileContent = readFileSync(filePath, "utf8");
  const { content, data } = matter(fileContent);

  console.log("Frontmatter:", data);
  console.log("Content length:", content.length);

  return (
    <div className="">
      <div className="fixed left-0 h-screen w-px bg-zinc-200 dark:bg-zinc-800 md:left-48" />
      <div className="fixed right-0 h-screen w-px bg-zinc-200 dark:bg-zinc-800 md:right-48" />

      <ScrollHeaderPage />

      <div className="mx-0 border border-zinc-300 p-2 dark:border-zinc-800 md:mx-48">
        <Header />
      </div>

      <div className="prose-xl space-y-8 md:mt-8">
        <div>
          <div className="top-0 h-px w-full bg-zinc-200 dark:bg-zinc-800" />

          <div className="mx-4 text-balance font-mono text-3xl font-semibold leading-tight tracking-tight md:mx-48">
            {data.title ?? "Untitled"}
          </div>

          <div className="bottom-0 h-px w-full bg-zinc-200 dark:bg-zinc-800" />
        </div>

        <div className="bottom-0 h-px w-full bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <div className="prose prose-base prose-h3:my-2 prose-h2:border-b prose-h2:pb-2 prose-ul:text-zinc-500 prose-ul:font-mono prose-ul:text-sm prose-h2:border-zinc-300 dark:prose-h2:border-zinc-800 max-w-none prose-a:font-mono font-sans text-foreground prose-zinc dark:prose-invert mx-2 prose-h2:my-4 md:mx-48">
        <div className="mx-2 text-balance p-4 font-mono text-base text-zinc-400 md:mx-40">
          {data.description ?? "Untitled"}
        </div>

        <div className="px-4 md:px-40">
          <MDXRemote source={content} components={components} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
