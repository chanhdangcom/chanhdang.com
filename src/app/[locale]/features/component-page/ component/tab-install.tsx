"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeBlock from "./code-block";

type TabPreViewProps = {
  pnpmCode?: string;
  yarnCode?: string;
  npmCode?: string;
  bunCode?: string;
  language?: string;
};

export function TabInstall({
  pnpmCode,
  yarnCode,
  npmCode,
  bunCode,
  language = "tsx",
}: TabPreViewProps) {
  return (
    <div className="grid grid-cols-1 justify-center font-apple">
      <Tabs defaultValue="pnpm">
        <div className="flex items-center justify-between">
          {/* Tabs trigger */}
          <TabsList className="gap-1 rounded-2xl bg-zinc-200 dark:bg-zinc-900">
            <TabsTrigger
              value="pnpm"
              className="rounded-xl data-[state=active]:bg-zinc-700 data-[state=active]:text-white dark:data-[state=active]:bg-zinc-200 dark:data-[state=active]:text-black"
            >
              pnpm
            </TabsTrigger>
            <TabsTrigger
              value="yarn"
              className="rounded-xl data-[state=active]:bg-zinc-700 data-[state=active]:text-white dark:data-[state=active]:bg-zinc-200 dark:data-[state=active]:text-black"
            >
              yarn
            </TabsTrigger>
            <TabsTrigger
              value="npm"
              className="rounded-xl data-[state=active]:bg-zinc-700 data-[state=active]:text-white dark:data-[state=active]:bg-zinc-200 dark:data-[state=active]:text-black"
            >
              npm
            </TabsTrigger>
            <TabsTrigger
              value="bun"
              className="rounded-xl data-[state=active]:bg-zinc-700 data-[state=active]:text-white dark:data-[state=active]:bg-zinc-200 dark:data-[state=active]:text-black"
            >
              bun
            </TabsTrigger>
          </TabsList>

          {/* Copy button (sẽ thêm ở đây sau) */}
        </div>

        {/* Tabs content */}
        <TabsContent value="pnpm ">
          <CodeBlock code={pnpmCode || ""} language={language} />
        </TabsContent>

        <TabsContent value="yarn">
          <CodeBlock code={yarnCode || ""} language={language} />
        </TabsContent>

        <TabsContent value="npm">
          <CodeBlock code={npmCode || ""} language={language} />
        </TabsContent>

        <TabsContent value="bun">
          <CodeBlock code={bunCode || ""} language={language} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
