import { readFileSync } from "fs";
import { join } from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";

import { ScrollHeaderPage } from "@/components/scroll-header-page";
import { TabPreView } from "./component/tab-preview";
import CodeBlock from "./component/code-block";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { TabInstall } from "./component/tab-install";
import { TabGroup, TabPanel } from "./component/tab-group";
import { Button } from "@/components/button-new";
import { Header } from "../profile /header";
import { Footer } from "../profile /footer";
import { Hello } from "../profile /components/hello";

const components = {
  TabPreView,
  CodeBlock,
  ThemeSwitcher,
  TabInstall,
  TabGroup,
  TabPanel,
  Button,
  Hello,
};

export function ComponentPage({ slug }: { slug: string }) {
  const filePath = join(process.cwd(), "docs", `${slug}`);

  const fileContent = readFileSync(filePath, "utf8");
  const { content, data } = matter(fileContent);

  return (
    <div>
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
      </div>

      <div className="prose prose-base prose-zinc mx-2 max-w-none font-sans text-foreground dark:prose-invert prose-h2:my-4 prose-h2:border-b prose-h2:border-zinc-300 prose-h2:pb-2 prose-h3:my-4 prose-a:font-mono prose-ul:font-mono prose-ul:text-sm prose-ul:text-zinc-500 dark:prose-h2:border-zinc-800 md:mx-48">
        <div className="m-4 text-balance font-mono text-base text-zinc-400 md:mx-40">
          {data.description ?? "Untitled"}
        </div>

        <div className="px-2 md:px-40">
          <MDXRemote source={content} components={components} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
