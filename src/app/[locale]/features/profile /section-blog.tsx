import { getPosts } from "@/api/blog/get-posts";

import { BlogList } from "./blog-list";

export async function SectionBlog() {
  const posts = await getPosts();

  return (
    <div className="rounded-3xl border border-zinc-200 bg-zinc-50 bg-[radial-gradient(circle,rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[size:12px_12px] p-2 dark:border-zinc-800 dark:bg-[#030610] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.12)_1px,transparent_1px)]">
      <div className="right-[40vh] h-1/2 w-5 bg-red-400" />

      <div className="relative left-0 top-8 z-50 h-1/2 w-5 bg-red-400" />

      <BlogList posts={posts} />
    </div>
  );
}
