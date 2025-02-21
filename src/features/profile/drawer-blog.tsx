"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { PageList } from "../blog/page-list";

export const DrawerBlog = () => {
  return (
    <Drawer>
      <DrawerTrigger className="rounded-xl border px-4 py-2 shadow-sm hover:underline dark:border-zinc-800">
        List
      </DrawerTrigger>
      <DrawerContent className="border bg-zinc-50 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto">
          <DrawerHeader>
            <div className="absolute inset-0 top-4 mx-auto h-2 w-32 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
            <DrawerTitle className="mx-auto font-mono text-xl">
              Blog List
            </DrawerTitle>
            <DrawerDescription className="mx-auto font-mono">
              Technology news.
            </DrawerDescription>
          </DrawerHeader>
          <div className="h-96 overflow-y-auto p-4">
            <PageList isList />
          </div>
          <DrawerFooter>
            <DrawerClose></DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
