import { DrawerBlog } from "../profile/drawer-blog";
import { getPosts } from "@/api/blog/get-posts";

import { BlogCarousel } from "./blog-carousel";
import { CodeTag } from "@/components/code-tag";

export async function SectionBlog() {
  const posts = await getPosts();

  return (
    <div className="my-2">
      <div className="mx-2 flex items-center justify-between space-x-2 font-mono text-sm">
        <CodeTag tagName="BLogs" shortTag />

        <DrawerBlog />
      </div>

      <BlogCarousel posts={posts} />
    </div>
  );
}
