import { getPosts } from "@/api/blog/get-posts";
import { BlogList } from "@/features/blog/blog-list";

export async function BlogListPage() {
  const posts = await getPosts();

  return (
    <div className="">
      <BlogList posts={posts} />
    </div>
  );
}
