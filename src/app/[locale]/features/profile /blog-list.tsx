import { IPost } from "@/app/[locale]/features/blog/types";
import { BlogListItem } from "@/components/blog-list-item";

export function BlogList({ posts }: { posts: IPost[] }) {
  return (
    <div className="relative w-full snap-x snap-mandatory overflow-x-auto scrollbar-hide">
      <div className="grid grid-flow-col grid-rows-2 justify-center gap-2 md:justify-start">
        {posts.map((post, key) => {
          return (
            <div key={key} className="snap-start">
              <BlogListItem post={post} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
