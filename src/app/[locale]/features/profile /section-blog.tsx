import { getPosts } from "@/api/blog/get-posts";

// import { BlogCarousel } from "./blog-carousel";

import { BlogList } from "./blog-list";
import { DrawerBlog } from "./drawer-blog";

export async function SectionBlog() {
  const posts = await getPosts();

  return (
    <div className="p-1">
      <div className="right-[40vh] h-1/2 w-5 bg-red-400" />

      <div className="m-4 flex items-center justify-start space-x-2 px-1 font-mono text-xl font-semibold">
        <DrawerBlog />
      </div>

      <div className="relative left-0 top-8 z-50 h-1/2 w-5 bg-red-400" />

      <BlogList posts={posts} />
    </div>
  );
}
