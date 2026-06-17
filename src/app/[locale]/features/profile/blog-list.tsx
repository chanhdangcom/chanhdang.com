import { IPost } from "@/app/[locale]/features/blog/types";
import { BlogListItem } from "@/components/blog-list-item";
import { cn } from "@/utils/cn";

export function BlogList({ posts }: { posts: IPost[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4">
      {posts.slice(0, 8).map((post, key) => {
        return (
          <div
            key={key}
            className={cn(
              "shrink-0 cursor-pointer snap-start border-r dark:border-zinc-900",
              key < 4 ? "border-b" : ""
            )}
          >
            <BlogListItem post={post} />
          </div>
        );
      })}
    </div>
  );
}
