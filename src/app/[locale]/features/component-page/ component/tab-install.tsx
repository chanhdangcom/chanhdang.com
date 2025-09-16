"use client";


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeBlock from "./code-block";


type TabPreViewProps = {
  pnpmCode?: string;
  yarnCode?: string;
  npmCode?: string;
  bunCode?: string;
  language?: string; // ngôn ngữ code (mặc định "tsx")
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
      <div className="flex items-center justify-between">
        {/* Tabs */}
        <Tabs defaultValue="pnpm" >
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
        </Tabs>

        {/* Copy button */}

      </div>

      <Tabs defaultValue="pnpm">
        <TabsContent value="pnpm">
          <div className="mt-2 rounded-2xl border bg-[#F5F2F0] dark:border-zinc-700 dark:bg-[#1e1e1e]">
            <CodeBlock code={pnpmCode || ""} language={language} />
          </div>
        </TabsContent>

        <TabsContent value="yarn">
          <div className="mt-2 rounded-2xl border bg-[#F5F2F0] dark:border-zinc-700 dark:bg-[#1e1e1e]">
            <CodeBlock code={yarnCode || ""} language={language} />
          </div>
        </TabsContent>

        <TabsContent value="npm">
          <div className="mt-2 rounded-2xl border bg-[#F5F2F0] dark:border-zinc-700 dark:bg-[#1e1e1e]">
            <CodeBlock code={npmCode || ""} language={language} />
          </div>
        </TabsContent>

        <TabsContent value="bun">
          <div className="mt-2 rounded-2xl border bg-[#F5F2F0] dark:border-zinc-700 dark:bg-[#1e1e1e]">
            <CodeBlock code={bunCode || ""} language={language} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}