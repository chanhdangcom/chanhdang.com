import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { BlogList } from "../blog/blog-list";
import { getPosts } from "@/api/blog/get-posts";

export async function DrawerBlog() {
  const posts = await getPosts();

  return (
    <Drawer>
      <DrawerTrigger className="rounded-xl border px-4 py-2 shadow-sm hover:underline dark:border-zinc-800">
        List
      </DrawerTrigger>

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
