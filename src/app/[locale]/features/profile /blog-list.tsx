import { IPost } from "@/app/[locale]/features/blog/types";
import { BlogListItem } from "@/components/blog-list-item";

export function BlogList({ posts }: { posts: IPost[] }) {
  return (
    <div className="relative w-full snap-x snap-mandatory overflow-x-auto scrollbar-hide">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {posts.map((post, key) => {
          return (
            <div key={key} className="snap-start">
              {key < 4 && <BlogListItem post={post} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
