import { DrawerBlog } from "../profile/drawer-blog";
import { getPosts } from "@/api/blog/get-posts";

// import { BlogCarousel } from "./blog-carousel";
import { CodeTag } from "@/components/code-tag";
import { BlogList } from "./blog-list";

export async function SectionBlog() {
  const posts = await getPosts();

  return (
    <div className="px-1 py-2">
      <div className="right-[40vh] h-1/2 w-5 bg-red-400"></div>
      <div className="flex items-center justify-between space-x-2 font-mono text-sm">
        <CodeTag tagName="BLogs" shortTag />

        <DrawerBlog />
      </div>

      <div className="relative left-0 top-8 z-50 h-1/2 w-5 bg-red-400"></div>

      {/* <BlogCarousel posts={posts} /> */}
      <BlogList posts={posts} />
    </div>
  );
}
