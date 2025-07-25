import { BlogList } from "../blog/blog-list";
import { getPosts } from "@/apii/blog/get-posts";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export async function DrawerBlog() {
  const posts = await getPosts();

  return (
    <Drawer>
      <HoverCard>
        <HoverCardTrigger>
          <DrawerTrigger className="rounded-xl border px-4 py-2 shadow-sm hover:underline dark:border-zinc-800">
            List
          </DrawerTrigger>
        </HoverCardTrigger>
        <HoverCardContent className="hidden w-fit border bg-zinc-100 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:flex">
          Displayed as a list
        </HoverCardContent>
      </HoverCard>

      <DrawerContent className="border bg-zinc-50 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <DrawerHeader className="border-b shadow-sm dark:border-zinc-900">
          <div className="absolute inset-0 top-4 mx-auto h-1.5 w-32 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
          <DrawerTitle className="mx-auto font-mono text-xl">
            Blog list
          </DrawerTitle>
          <DrawerDescription className="mx-auto font-mono">
            Technology news.
          </DrawerDescription>
        </DrawerHeader>

        <div className="mx-auto h-[70vh] overflow-y-auto p-4">
          <BlogList posts={posts} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
