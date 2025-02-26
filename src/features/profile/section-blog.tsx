import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carouse";
import { BookIcon } from "lucide-react";
import { ExperienceInfoItem } from "../profile/components/experience-info-item";
import { DrawerBlog } from "../profile/drawer-blog";
import { getPosts } from "@/api/blog/get-posts";
import { BlogCarouselItem } from "../blog/blog-carousel-item";

export async function SectionBlog() {
  const posts = await getPosts();

  return (
    <div className="mt-4">
      <div className="my-2 flex items-center justify-between space-x-2 font-mono text-sm">
        <ExperienceInfoItem icon={<BookIcon />} content="Blogs" />
        <DrawerBlog />
      </div>

      <Carousel className="w-full max-w-4xl">
        <CarouselContent className="p-2">
          {posts.map((post) => (
            <BlogCarouselItem key={post.documentId} post={post} />
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
