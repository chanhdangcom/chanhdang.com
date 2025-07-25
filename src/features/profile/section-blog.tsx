import { BookIcon } from "lucide-react";
import { ExperienceInfoItem } from "../profile/components/experience-info-item";
import { DrawerBlog } from "../profile/drawer-blog";
import { getPosts } from "@/apii/blog/get-posts";

import { BlogCarousel } from "./blog-carousel";

export async function SectionBlog() {
  const posts = await getPosts();

  return (
    <div className="mt-4">
      <div className="my-2 flex items-center justify-between space-x-2 font-mono text-sm">
        <ExperienceInfoItem icon={<BookIcon />} content="Blogs" />
        <DrawerBlog />
      </div>

      <BlogCarousel posts={posts} />
    </div>
  );
}
