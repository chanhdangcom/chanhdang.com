"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type TabPanelProps = {
  value: "preview" | "code";
  children: React.ReactNode;
};

export function TabPanel({ children }: TabPanelProps) {
  return <>{children}</>;
}

type TabGroupProps = {
  children: React.ReactNode;
};

export function TabGroup({ children }: TabGroupProps) {
  const panels = React.Children.toArray(
    children
  ) as React.ReactElement<TabPanelProps>[];

  return (
    <Tabs defaultValue="preview">
      <TabsList className="gap-1 rounded-xl bg-zinc-200 font-apple font-semibold dark:bg-zinc-900">
        <TabsTrigger
          value="preview"
          className="rounded-xl data-[state=active]:bg-zinc-700 data-[state=active]:text-white dark:data-[state=active]:bg-zinc-200 dark:data-[state=active]:text-black"
        >
          Shadcn CIL
        </TabsTrigger>

        <TabsTrigger
          value="code"
          className="rounded-xl data-[state=active]:bg-zinc-700 data-[state=active]:text-white dark:data-[state=active]:bg-zinc-200 dark:data-[state=active]:text-black"
        >
          Manual
        </TabsTrigger>
      </TabsList>

      {/* contents */}
      {panels.map((panel) => (
        <TabsContent key={panel.props.value} value={panel.props.value} className="mt-4">
          {panel.props.children}
        </TabsContent>
      ))}
    </Tabs>
  );
}
