import { IPost } from "@/app/[locale]/features/blog/types";
import { BlogListItem } from "@/components/blog-list-item";

export function BlogList({ posts }: { posts: IPost[] }) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3">
        {posts.map((post, key) => {
          return (
            <div key={key} className="snap-start">
              {key < 6 && <BlogListItem post={post} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
