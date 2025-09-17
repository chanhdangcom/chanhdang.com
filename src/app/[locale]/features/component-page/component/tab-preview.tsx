"use client";

import CodeBlock from "@/app/[locale]/features/component-page/component/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabPreViewProps = {
  preview: React.ReactNode;
  code: string;
  language?: string;
};

export function TabPreView({
  preview,
  code,
  language = "tsx",
}: TabPreViewProps) {
  return (
    <div className="grid grid-cols-1 justify-center">
      <Tabs defaultValue="preview">
        <TabsList className="gap-1 rounded-2xl bg-zinc-200 font-apple font-semibold dark:bg-zinc-900">
          <TabsTrigger
            value="preview"
            className="rounded-xl data-[state=active]:bg-zinc-700 data-[state=active]:text-white dark:data-[state=active]:bg-zinc-200 dark:data-[state=active]:text-black"
          >
            Preview
          </TabsTrigger>

          <TabsTrigger
            value="code"
            className="rounded-xl data-[state=active]:bg-zinc-700 data-[state=active]:text-white dark:data-[state=active]:bg-zinc-200 dark:data-[state=active]:text-black"
          >
            Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <div className="mt-2 rounded-2xl border bg-[radial-gradient(circle,rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[size:12px_12px] py-4 dark:border-zinc-800 dark:bg-[#030610] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)]">
            <div className="flex h-80 items-center justify-center">
              {preview}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="code">
          <CodeBlock code={code} language={language} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
