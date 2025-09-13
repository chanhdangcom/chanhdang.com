import { getPosts } from "@/api/blog/get-posts";

import { BlogList } from "./blog-list";

export async function SectionBlog() {
  const posts = await getPosts();

  return (
    <div>
      <BlogList posts={posts} />
    </div>
  );
}
